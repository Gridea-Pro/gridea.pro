---
title: GitHub Pages 部署
description: 将 Gridea Pro 博客部署到 GitHub Pages 的完整步骤，包括 OAuth 一键授权、手动 Token 配置以及自定义域名。
---

GitHub Pages 是最常用的免费静态站点托管服务，与 Gridea Pro 的 Git 部署模式完美契合。Gridea Pro 为 GitHub 提供了两种凭据配置方式：**OAuth 一键授权**（推荐）和**手动 Personal Access Token**。

## 前置条件

- 一个 GitHub 账号
- 系统默认浏览器已登录该账号（OAuth 方式会用到）

## 使用 OAuth 授权（推荐）

OAuth 模式不需要你去 GitHub 后台生成 Token、不需要记忆 scope、不需要手动创建仓库。整个流程大约 20 秒。

### 授权步骤

1. 打开 Gridea Pro，进入 **设置 > 网络**。
2. 在 **GitHub Pages** 卡片上点击 **OAuth 授权**。
3. Gridea Pro 会在本地 `127.0.0.1` 上启动一个一次性回调服务（随机端口），并用系统默认浏览器打开如下授权页面：

   ```
   https://github.com/login/oauth/authorize
     ?client_id=<Gridea Pro 的 GitHub OAuth App ID>
     &redirect_uri=http://127.0.0.1:<随机端口>/oauth/callback
     &scope=public_repo,read:user,user:email
     &state=<随机 state>
   ```

4. 在 GitHub 页面确认权限并点击 **Authorize Gridea Pro**。此时 GitHub 会把浏览器 302 跳回本地回调地址，Gridea Pro 接住 `code` 参数。
5. Gridea Pro 用 `code` 向 GitHub 交换 `access_token`，随后调用 `GET /user` 拉取 username、邮箱和头像。
6. 浏览器显示"授权成功"页面，应用内卡片变为绿色"已连接 · OAuth"并显示你的 GitHub 头像。

### OAuth 权限 (Scopes)

Gridea Pro 申请的权限是最小集：

| Scope | 用途 |
|-------|------|
| `public_repo` | 创建仓库、推送静态站点文件 |
| `read:user` | 读取用户名、头像，用于 UI 展示和仓库名推导 |
| `user:email` | 读取主邮箱，作为 Git 提交的 `author.email` |

:::tip
OAuth 模式申请的是 `public_repo`，因此自动建的博客仓库是**公开**的——这正是 GitHub Pages 免费版的要求。如果你需要把博客放在私有仓库（Pro / Team 账户），请使用手动 Token 模式并勾选 `repo`。
:::

### 授权成功后自动回填的字段

| 字段 | 自动填充值 |
|------|-----------|
| 仓库名 | `<username>.github.io`（如果不存在会自动创建） |
| 分支 | `main`（原本为空时） |
| 用户名 | GitHub 用户名 |
| 邮箱 | GitHub 主邮箱 |
| 站点域名 | `https://<username>.github.io` |
| 头像 URL | GitHub 头像 URL |

如果 `<username>.github.io` 仓库已经存在，Gridea Pro 会直接复用；如果不存在，授权后会通过 GitHub API 自动创建一个空的公开仓库，立即可用。

你依然可以在授权完成后手动改为其他仓库名，比如 `blog-source` + `gh-pages` 分支组合。

### 取消 GitHub 授权

1. 在 **GitHub Pages** 卡片上点击 **断开连接**。
2. 确认弹窗后，Gridea Pro 会：
   - 从系统 Keychain 删除 `github:token` 条目；
   - 清空应用内的 GitHub 用户名、邮箱、头像等元数据；
   - 卡片恢复"未连接"。
3. **（强烈建议）同时在 GitHub 侧撤销授权**：
   - 打开 <https://github.com/settings/applications>
   - 在 **Authorized OAuth Apps** 中找到 **Gridea Pro**
   - 点击 **Revoke** → 确认

只有这一步做完，之前颁发的 `access_token` 才会真正失效——之后即使令牌泄露也无法调用 GitHub API。

### OAuth 常见故障

| 现象 | 排查方向 |
|------|---------|
| 浏览器卡在 "Authorize" 页，点击后没有跳回 | 检查是否禁用了本地回环、是否使用了强制代理全部流量的 VPN |
| 跳回后显示"授权失败：state 不匹配" | 大概率是复制了旧链接或者浏览器拦截了回调，重新点一次 OAuth 即可 |
| 60 秒后按钮自动复原 | 前端超时，说明回调没回来。检查浏览器是否被挡在网络层，或重试 |
| 提示 "repo <username>.github.io already exists but empty" | 正常日志，不影响使用 |

## 使用手动 Personal Access Token

适合企业网络受限无法完成 OAuth、或者需要推送到私有仓库的场景。

### 第一步：创建 GitHub 仓库

1. 登录 GitHub，点击 **New repository**
2. 仓库名称填写 `<你的用户名>.github.io`（例如 `zhangsan.github.io`）
3. 设置为 **Public**（GitHub Pages 免费版要求公开仓库）
4. 不要勾选 "Initialize this repository"

:::tip
如果你不想使用 `<用户名>.github.io` 格式，也可以创建任意名称的仓库，然后使用 `gh-pages` 分支部署。最终地址为 `https://<用户名>.github.io/<仓库名>/`。
:::

### 第二步：生成 Personal Access Token

1. 进入 GitHub **Settings > Developer settings > Personal access tokens > Tokens (classic)**
2. 点击 **Generate new token (classic)**
3. 勾选 `repo` 权限（完整的仓库读写权限）
4. 设置合适的过期时间，点击 Generate
5. 复制生成的 Token

:::danger
Token 只在生成时显示一次。务必立即复制并保存到安全的位置。如果丢失，需要重新生成。
:::

### 第三步：在 Gridea Pro 中填写

在 **设置 > 网络 > GitHub Pages** 卡片上点击 **手动配置**，填写：

| 配置项 | 值 |
|--------|-----|
| 平台 | GitHub |
| 仓库地址 | `https://github.com/<用户名>/<用户名>.github.io` |
| 分支 | `main` |
| Token | 上一步生成的 Token |
| 域名 | `https://<用户名>.github.io` |

保存后状态变为黄色"已配置 · 手动"。你随时可以点击"改用 OAuth 授权"升级成 OAuth 模式。

## 第四步：同步部署

点击 Gridea Pro 的 **同步** 按钮，等待推送完成。首次同步后，访问 `https://<用户名>.github.io` 即可看到你的博客。

:::note
GitHub Pages 首次部署可能需要几分钟才能生效。如果访问返回 404，请等待 2-5 分钟后重试。你也可以在仓库的 **Settings > Pages** 中查看部署状态。
:::

## 自定义域名

1. 在域名 DNS 中添加 CNAME 记录：`blog.example.com` -> `<用户名>.github.io`
2. 在 GitHub 仓库 **Settings > Pages > Custom domain** 中填写 `blog.example.com`
3. 勾选 **Enforce HTTPS**
4. 在 Gridea Pro 中将站点域名改为 `https://blog.example.com`

## 常见问题

| 问题 | 解决方案 |
|------|----------|
| 同步失败提示 401 | Token 过期/被撤销，或 OAuth 令牌在 GitHub 侧被 Revoke。重新授权即可 |
| 页面显示 README 而非博客 | 确认 GitHub Pages 的 Source 设置为正确的分支 |
| CSS 样式丢失 | 检查站点域名配置是否包含仓库名路径 |
| OAuth 授权后 push 仍失败 | 检查仓库可见性：公开仓库用 `public_repo` 即可，私有仓库需改为手动 Token + 完整 `repo` |

关于 OAuth 的整体机制、端口占用、令牌存储位置等细节，请参阅 [OAuth 授权总览](./oauth/)。更多部署问题请查阅[常见问题](/faq/)。
