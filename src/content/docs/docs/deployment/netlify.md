---
title: Netlify 部署
description: 将 Gridea Pro 博客部署到 Netlify，利用持续部署和全球 CDN 托管博客。支持 OAuth 一键授权与传统的"通过 GitHub 仓库部署"方式。
---

Netlify 提供持续部署、全球 CDN、自动 HTTPS 等特性，是静态站点托管的热门选择。Gridea Pro 对 Netlify 支持两种接入路径：

- **OAuth 授权 + Netlify API 直接部署**（Gridea Pro 新版特性）
- **先推到 GitHub，再由 Netlify 从 GitHub 拉取**（传统方式，适合想让每次 Git push 自动触发 Netlify 构建的用户）

两者互不冲突，你可以只用其中一种，也可以同时保留（前者负责一键部署，后者负责基于 GitHub 的 CI）。

## 使用 OAuth 授权

这是新版推荐的、**完全脱离 GitHub 的直接部署路径**：Gridea Pro 通过 OAuth 拿到你的 Netlify API Token，然后把生成的静态站点通过 Netlify API 上传到一个指定的 Site。

### 授权步骤

1. 先到 Netlify 创建一个 Site（可以是空的）。Netlify 目前不允许第三方在用户没有显式选择 Site 的情况下创建站点，因此 Gridea Pro 不会自动帮你建 Site。
   - 登录 <https://app.netlify.com/> → **Add new site > Deploy manually** → 拖一个占位的 `index.html` 上去即可。
   - 站点创建后记下 **Site ID**（在 Site 的 **Site configuration > General > Site details** 里）。
2. 打开 Gridea Pro，进入 **设置 > 网络**。
3. 在 **Netlify** 卡片点击 **OAuth 授权**。
4. Gridea Pro 在本地启动一次性回调服务（随机端口），并用系统默认浏览器打开 Netlify 的授权页面：

   ```
   https://app.netlify.com/authorize
     ?state=<随机 state>
   ```

   :::note
   注意 Netlify 的授权 URL **不带 `client_id`**——这是 Netlify OAuth 的非标准做法，应用标识是在 Netlify 后台注册时绑定的。Gridea Pro 用内部的 `CustomBuildAuthURL` 来处理这种差异。
   :::

5. 在 Netlify 页面确认并点击 **Authorize**。Netlify 302 回到本地回调，Gridea Pro 用 `code` 调 `POST https://api.netlify.com/oauth/token` 换取 `access_token`，再调 `GET /api/v1/user` 拉取账号信息。
6. 浏览器显示"授权成功"页面，应用内卡片变为绿色"已连接 · OAuth"。

### 授权成功后自动回填的字段

| 字段 | 自动填充值 |
|------|-----------|
| 用户名 | Netlify 显示名（若无则 fallback 到邮箱） |
| 邮箱 | Netlify 账户邮箱 |
| 头像 URL | Netlify 头像 URL |
| **Site ID** | ❌ **不自动填，需要你手填** |
| **域名** | ❌ **不自动填** |

:::caution
与 GitHub / Gitee 不同，OAuth 授权**不会**自动创建 Netlify Site，也**不会**回填 Site ID 或域名。你必须手动在 Netlify 创建 Site 并把 Site ID 粘贴到 Gridea Pro 配置里。这是因为 Netlify 允许单账号下有许多 Site，Gridea Pro 无法猜到你想往哪个 Site 推。
:::

在 Netlify 卡片的配置抽屉里填写：

| 字段 | 值 |
|------|-----|
| Netlify Site ID | 从 Netlify 后台复制的 UUID，例如 `12345678-abcd-ef01-2345-6789abcdef01` |
| 站点域名 | Netlify 给的 `*.netlify.app` 或你的自定义域名，例如 `https://my-blog.netlify.app` |

保存后点击 **同步**，Gridea Pro 会把整个 `output/` 目录通过 Netlify 的 File Digest API 直接上传到该 Site。**不再需要 GitHub 仓库中转**。

### OAuth 权限

Netlify OAuth 没有细粒度 scope，授权即获得账户级的 API 访问能力。`access_token` 等价于一个可以读写账号下所有 Site 的长期 Token，请小心保管——Gridea Pro 把它存放在系统 Keychain 中（键名 `netlify:netlifyAccessToken`），参见 [OAuth 授权总览](./oauth/#令牌存储在哪里)。

### 取消 Netlify 授权

1. 在 **Netlify** 卡片点击 **断开连接** → 确认。
2. Gridea Pro 会从系统 Keychain 删除 `netlify:netlifyAccessToken`，并清空本机上的 Netlify 元数据。**注意**：Site ID 会一并被清空，重新授权后你需要再次粘贴 Site ID。
3. **（强烈建议）同时在 Netlify 官网撤销授权**：
   - 打开 <https://app.netlify.com/user/applications>
   - 在 **Authorized applications** 列表中找到 **Gridea Pro**
   - 点击 **Revoke**

由于 Netlify 的 Token 权限范围较大，Netlify 这一步尤其重要——只有在 Netlify 侧撤销后，之前的 Token 才无法再调用 API。

## 通过 GitHub 仓库部署（传统方式）

如果你更喜欢"Gridea Pro 同步到 GitHub → Netlify 自动构建部署"的 CI 模式，可以继续使用原来的流程：

1. 先将 Gridea Pro 配置为推送到 GitHub 仓库（参考 [GitHub Pages 部署](./github-pages/)）
2. 登录 [Netlify](https://netlify.com)，点击 **Add new site > Import an existing project**
3. 选择 GitHub，授权并选择博客仓库
4. 配置构建设置：

| 配置项 | 值 |
|--------|-----|
| Build command | 留空 |
| Publish directory | `.` |
| Branch | `main`（与 Gridea Pro 配置一致） |

5. 点击 **Deploy site**

:::tip
Netlify 会为你分配一个随机子域名（如 `random-name-123.netlify.app`），你可以在 **Site settings > Domain management** 中修改为更友好的名称。
:::

这种方式**不需要**在 Gridea Pro 里配置 Netlify 卡片——对 Gridea Pro 而言你只是在往 GitHub 推，Netlify 是 GitHub 的下游订阅者。

## 自定义域名

1. 进入 **Site settings > Domain management > Add custom domain**
2. 输入你的域名并验证
3. Netlify 会提示你添加 DNS 记录：
   - CNAME: `blog.example.com` -> `your-site.netlify.app`
   - 或将 Nameserver 迁移到 Netlify DNS
4. HTTPS 证书自动签发

## 404 页面配置

Gridea Pro 生成的 `404.html` 会被 Netlify 自动识别为自定义错误页面，无需额外配置。

:::note
Netlify 自动检测根目录下的 `404.html` 文件。如果你的主题包含 `templates/404.html` 模板，Gridea Pro 会自动生成对应的 `404.html` 输出文件。
:::

## 高级配置

在仓库根目录创建 `netlify.toml` 文件自定义行为：

```toml
[build]
  publish = "."

[[headers]]
  for = "/styles/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

## 表单和函数

Netlify 还提供表单处理和 Serverless Functions 等附加功能。虽然 Gridea Pro 生成的是纯静态站点，但你可以在主题模板中添加 Netlify Forms 来收集读者反馈：

```html
<form name="contact" method="POST" data-netlify="true">
  <input type="text" name="name" placeholder="你的名字" />
  <textarea name="message" placeholder="留言内容"></textarea>
  <button type="submit">发送</button>
</form>
```

## Netlify 免费套餐

| 特性 | 限制 |
|------|------|
| 带宽 | 100 GB / 月 |
| 构建时间 | 300 分钟 / 月 |
| 站点数 | 无限 |
| HTTPS | 自动、免费 |
| 表单提交 | 100 次 / 月 |

关于 OAuth 的整体机制、令牌存储与撤销细节，请参阅 [OAuth 授权总览](./oauth/)。如遇其它问题，请查阅[常见问题](/faq/)。
