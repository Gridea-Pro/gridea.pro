---
title: Gitee Pages 部署
description: 将 Gridea Pro 博客部署到 Gitee Pages，适合国内用户快速访问。支持 OAuth 一键授权和手动私人令牌两种配置方式。
---

Gitee Pages 是国内 Git 平台 Gitee 提供的静态页面托管服务，国内访问速度快，无需备案。Gridea Pro 为 Gitee 提供 **OAuth 一键授权**（推荐）和**手动私人令牌**两种配置方式。

## 前提条件

- 注册 [Gitee](https://gitee.com) 账号
- 系统默认浏览器已登录该账号（OAuth 方式会用到）
- 本机 TCP **53682** 端口空闲（OAuth 方式的固定回调端口，见下文）

## 使用 OAuth 授权（推荐）

### 授权步骤

1. 打开 Gridea Pro，进入 **设置 > 网络**。
2. 在 **Gitee Pages** 卡片上点击 **OAuth 授权**。
3. Gridea Pro 在本地启动固定端口 **53682** 的回调服务，并用系统默认浏览器打开：

   ```
   https://gitee.com/oauth/authorize
     ?client_id=<Gridea Pro 的 Gitee 应用 ID>
     &redirect_uri=http://127.0.0.1:53682/oauth/callback
     &response_type=code
     &scope=projects%20user_info%20emails
     &state=<随机 state>
   ```

4. 在 Gitee 页面登录（支持账号密码 / 微信 / QQ 扫码），点击 **同意授权**。
5. Gitee 把浏览器跳回本地回调地址，Gridea Pro 依次：
   - 用 `code` 调 `POST https://gitee.com/oauth/token` 换取 `access_token`
   - 调 `GET /api/v5/user` 拉取用户名和头像
   - 调 `GET /api/v5/emails` 拉取主邮箱（Gitee 的用户接口不返回邮箱，必须单独请求）
6. 如果 `<username>` 仓库不存在，Gridea Pro 会用 `POST /api/v5/user/repos` 自动创建一个公开仓库：

   ```json
   {
     "name": "<username>",
     "description": "My blog powered by Gridea Pro",
     "private": false,
     "auto_init": true
   }
   ```

7. 浏览器显示"授权成功"页面，应用内卡片变为绿色"已连接 · OAuth"。

:::caution
**Gitee 必须使用固定端口 53682**。与 GitHub 不同，Gitee OAuth 要求回调 URL 与应用注册时填写的地址完全一致，不允许任意端口。如果你的本机 53682 端口被占用（例如另一个开发服务器、代理工具），OAuth 会失败。请关闭占用该端口的进程后再试。

在 macOS 可用 `lsof -nP -iTCP:53682 -sTCP:LISTEN` 查占用进程，Windows 可用 `netstat -ano | findstr :53682`。
:::

### OAuth 权限 (Scopes)

| Scope | 用途 |
|-------|------|
| `projects` | 读写仓库、创建仓库、推送文件 |
| `user_info` | 读取用户名和头像 |
| `emails` | 读取主邮箱 |

### 授权成功后自动回填的字段

| 字段 | 自动填充值 |
|------|-----------|
| 仓库名 | `<username>` 小写（不像 GitHub 要加 `.github.io` 后缀） |
| 分支 | `master`（Gitee 默认分支，原本为空时） |
| 用户名 | Gitee 用户名 |
| 邮箱 | Gitee 主邮箱 |
| 站点域名 | `https://<username>.gitee.io` |
| 头像 URL | Gitee 头像 URL |

:::note
注意 Gitee 的默认分支是 `master`，与 GitHub 的 `main` 不同。如果你的仓库是手动建的并自定义了分支名，请在授权后手动调整。
:::

### 取消 Gitee 授权

1. 在 **Gitee Pages** 卡片点击 **断开连接** → 确认。
2. Gridea Pro 会从系统 Keychain 删除 `gitee:token`，并清空应用内的 Gitee 用户名、邮箱、头像。
3. **（强烈建议）同时在 Gitee 官网撤销授权**：
   - 打开 <https://gitee.com/profile/applications>
   - 切到 **第三方应用** 标签
   - 找到 **Gridea Pro**，点击 **取消授权**

撤销后颁发的 `access_token` 会立即在 Gitee 服务端失效。

## 使用手动私人令牌

适合企业网络无法完成 OAuth，或者 53682 端口被占用且无法释放的场景。

### 1. 创建 Gitee 仓库

1. 登录 Gitee，点击右上角 **+** > **新建仓库**
2. 仓库名称建议设为你的用户名（例如 `username`），这样博客地址为 `username.gitee.io`
3. 设置为 **公开** 仓库
4. 初始化仓库（勾选 README）

### 2. 生成私人令牌

1. 进入 Gitee **设置** > **私人令牌** > **生成新令牌**
2. 填写令牌描述，如 `gridea-pro`
3. 勾选 `projects` 权限
4. 点击 **提交**，复制生成的令牌

:::caution
令牌只显示一次，请妥善保存。如果丢失需要重新生成。
:::

### 3. 在 Gridea Pro 中填写

在 **设置 > 网络 > Gitee Pages** 卡片点击 **手动配置**，填写：

- **仓库地址** — 格式如 `https://gitee.com/username/repo`
- **分支** — 通常为 `master`
- **用户名** — Gitee 用户名
- **邮箱** — Gitee 注册邮箱
- **Token** — 上一步生成的私人令牌

保存后状态变为黄色"已配置 · 手动"。随时可以点击"改用 OAuth 授权"升级。

## 部署

1. 点击 Gridea Pro 顶部的 **同步** 按钮
2. 等待渲染和推送完成

## 开启 Gitee Pages 服务

:::caution
首次部署后，需要在 Gitee 仓库中手动开启 Pages 服务：
:::

1. 进入 Gitee 仓库页面
2. 点击 **服务** > **Gitee Pages**
3. 选择部署分支（与 Gridea Pro 中配置的一致）
4. 点击 **启动**
5. 后续更新部署后，需要点击 **更新** 按钮刷新页面

## 自定义域名

1. 在 Gitee Pages 设置页面中填写自定义域名
2. 在域名 DNS 服务商处添加 CNAME 记录，指向 `username.gitee.io`
3. 等待 DNS 生效

## 注意事项

- Gitee Pages 免费版需要手动点击「更新」才能刷新部署内容
- Gitee Pages Pro（付费版）支持自动部署和自定义域名 HTTPS
- Gitee 默认分支为 `master`，注意与 GitHub 的 `main` 区分
- OAuth 的 53682 端口占用问题是最常见的授权失败原因，排查时优先检查这里

关于 OAuth 的整体机制、令牌存储、在平台侧彻底撤销的意义等，请参阅 [OAuth 授权总览](./oauth/)。
