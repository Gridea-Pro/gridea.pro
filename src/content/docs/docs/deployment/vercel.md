---
title: Vercel 部署
description: 将 Gridea Pro 博客部署到 Vercel，享受全球 CDN 加速和自动 HTTPS。支持 Gridea Pro 原生 OAuth 集成、GitHub 中转以及 Vercel CLI 三种方式。
---

Vercel 提供全球边缘网络、自动 HTTPS 和极速部署，非常适合静态博客托管。Gridea Pro 对 Vercel 支持三种部署方式：

- **OAuth 集成**（新版推荐）—— 直接从 Gridea Pro 登录 Vercel，由应用自身把静态文件推到 Vercel Deployment API
- **通过 GitHub 仓库**（传统推荐）—— Gridea Pro 推到 GitHub，Vercel 监听仓库自动构建
- **Vercel CLI 手动部署** —— 用 `vercel --prod` 一次性上传

## 使用 OAuth 授权

Gridea Pro 在 Vercel Marketplace 上注册了一个 **Vercel Integration**（slug: `gridea-pro`）。这个 Integration 使用的是 Vercel 的 App 级授权而非标准 OAuth 2.0，流程与 GitHub/Gitee 略有不同。

### 授权步骤

1. 打开 Gridea Pro，进入 **设置 > 网络**。
2. 在 **Vercel** 卡片点击 **OAuth 授权**。
3. Gridea Pro 在本地启动固定端口 **53683** 的回调服务，并用系统默认浏览器打开 Vercel Integration 安装页：

   ```
   https://vercel.com/integrations/gridea-pro/new
     ?state=<随机 state>
   ```

   :::note
   注意这不是 `https://vercel.com/oauth/authorize` ——Vercel Integration 用的是安装流程，而不是纯 OAuth 授权页。URL 中**不带 `client_id`**，Gridea Pro 内部用 `CustomBuildAuthURL` 处理。
   :::

4. 在 Vercel 页面登录，选择要授权的 Team 或 Personal Account，点击 **Install**。
5. Vercel 302 回调到 `http://127.0.0.1:53683/oauth/callback?code=...&state=...`。
6. Gridea Pro：
   - 调 `POST https://api.vercel.com/v2/oauth/access_token` 用 `code` 换 `access_token`
   - 调 `GET https://api.vercel.com/v2/user` 拉取 username、邮箱、Team 信息
   - 根据 username 构造头像 URL：`https://vercel.com/api/www/avatar/<username>?s=160`
7. 浏览器显示"授权成功"页面，应用内卡片变为绿色"已连接 · OAuth"。

:::caution
**Vercel 必须使用固定端口 53683**。Vercel Integration 在 Marketplace 注册时只能填一个固定回调地址，Gridea Pro 用了 `http://127.0.0.1:53683/oauth/callback`。如果这个端口被占用（例如另一个 Vercel 应用、LSP 服务器、代理工具），OAuth 会失败。排查方法与 Gitee 类似：macOS 用 `lsof -nP -iTCP:53683 -sTCP:LISTEN`，Windows 用 `netstat -ano | findstr :53683`。
:::

### 授权成功后自动回填的字段

| 字段 | 自动填充值 |
|------|-----------|
| 项目名 | `<username>-blog` |
| 站点域名 | `https://<username>-blog.vercel.app` |
| 用户名 | Vercel username |
| 邮箱 | Vercel 账户邮箱 |
| 头像 URL | `https://vercel.com/api/www/avatar/<username>?s=160` |

`<username>-blog` 只是一个**默认建议**，你可以在授权后立即把项目名改成任何合法的 Vercel 项目名（只能含小写字母、数字、连字符，长度 ≤ 100）。改完后站点域名也需要相应修改为 `https://<新项目名>.vercel.app`。

:::note
与 GitHub / Gitee 不同，OAuth 授权后 Gridea Pro **不会**自动在 Vercel 上创建项目。项目会在你**第一次点击同步**时由 Vercel Deployment API 创建：
```
POST https://api.vercel.com/v13/deployments
{
  "name": "<username>-blog",
  "files": [ ... ],
  "projectSettings": { "framework": null }
}
```
如果该名字的项目已存在且属于当前账号，Vercel 会把这次同步当作该项目的新一次 Deployment。
:::

### 取消 Vercel 授权

1. 在 **Vercel** 卡片点击 **断开连接** → 确认。
2. Gridea Pro 会从系统 Keychain 删除 `vercel:token`，并清空本机上的 Vercel 用户名、项目名、头像等元数据。
3. **（强烈建议）同时在 Vercel 官网移除 Integration**：
   - 打开 <https://vercel.com/dashboard/integrations>
   - 找到 **Gridea Pro**
   - 点击 **Configure** → **Remove Integration**

Vercel Integration 的 Token 属于账户级 API Token，能操作账户下所有项目，因此 Vercel 侧的撤销非常重要——只有这一步做完，之前颁发的 `access_token` 才会在 Vercel 服务端失效。

## 通过 GitHub 仓库部署（传统方式）

这种方式利用 Vercel 与 GitHub 的集成，每次 Gridea Pro 同步推送后自动触发部署。

1. 先按照 [GitHub Pages 部署](./github-pages/)的步骤创建 GitHub 仓库并配置 Gridea Pro
2. 登录 [Vercel](https://vercel.com)，点击 **Import Project**
3. 选择你的博客仓库
4. Framework Preset 选择 **Other**
5. Build Command 留空（Gridea Pro 已经生成了静态文件）
6. Output Directory 设置为 `.`（根目录）
7. 点击 **Deploy**

:::tip
使用此方式后，每次在 Gridea Pro 中点击同步，Vercel 会自动检测到仓库变化并重新部署，通常在几秒内完成。
:::

这种方式**不需要**在 Gridea Pro 里配置 Vercel 卡片，Gridea Pro 只负责推到 GitHub。

## 方式三：Vercel CLI 手动部署

如果不想通过 OAuth 也不想经 GitHub，可以使用 Vercel CLI 直接上传：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 进入 Gridea Pro 的输出目录
cd ~/Documents/Gridea/output

# 部署
vercel --prod
```

## 自定义域名

1. 在 Vercel 项目的 **Settings > Domains** 中添加你的域名
2. 按照提示在 DNS 中添加对应记录（CNAME 或 A 记录）
3. Vercel 会自动签发 SSL 证书
4. 在 Gridea Pro 中更新站点域名

## 环境配置

Vercel 免费套餐包含：

| 特性 | 限制 |
|------|------|
| 带宽 | 100 GB / 月 |
| 构建次数 | 6000 次 / 月 |
| 自定义域名 | 50 个 |
| HTTPS | 自动、免费 |
| 全球 CDN | 包含 |

:::note
对于个人博客，Vercel 免费套餐的额度绰绰有余。即使日均数千访问量也不会超出限制。
:::

## 高级配置

可以在仓库根目录创建 `vercel.json` 自定义路由和头信息：

```json
{
  "headers": [
    {
      "source": "/styles/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/404.html" }
  ]
}
```

关于 OAuth 的整体机制、令牌存储位置、固定端口冲突排查等，请参阅 [OAuth 授权总览](./oauth/)。如遇其它问题，请查阅[常见问题](/faq/)或[部署概述](./index.md)中的通用排查步骤。
