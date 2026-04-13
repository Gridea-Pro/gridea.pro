---
title: OAuth 授权总览
description: Gridea Pro 在"设置 > 网络"中提供 OAuth 一键授权，自动完成令牌获取、仓库创建与配置回填。本文介绍其工作原理、各平台差异、取消授权方式与安全说明。
---

从 Gridea Pro 新版开始，**设置 > 网络** 为 GitHub、Gitee、Netlify、Vercel 四个平台提供了原生的 OAuth 一键授权，免去"去官网复制 Token → 粘回来 → 手填仓库 / 分支 / 域名"的繁琐流程。

本页先解释 OAuth 模式的整体工作机制，再给出各平台的差异对照。如果你只关心某个平台的操作步骤，也可以直接跳转到：

- [GitHub Pages OAuth 授权](./github-pages/#使用-oauth-授权推荐)
- [Gitee Pages OAuth 授权](./gitee/#使用-oauth-授权推荐)
- [Netlify OAuth 授权](./netlify/#使用-oauth-授权)
- [Vercel OAuth 授权](./vercel/#使用-oauth-授权)

## 哪些平台支持 OAuth？

| 平台 | OAuth 授权 | 手动 Token | 自动建仓 | 自动回填仓库/域名 |
|------|-----------|-----------|---------|------------------|
| **GitHub Pages** | 支持 | 支持 | 支持 | 支持 |
| **Gitee Pages** | 支持 | 支持 | 支持 | 支持 |
| **Netlify** | 支持 | 支持 | 不涉及 | 不涉及（Site ID 需手填） |
| **Vercel** | 支持 | 支持 | 不涉及 | 项目名 / 域名自动回填 |
| **Coding Pages** | 不支持 | 支持 | 不支持 | 不支持 |
| **SFTP / FTP** | 不适用 | 账号密码或密钥 | 不适用 | 不适用 |

:::tip
所有支持 OAuth 的平台也都保留了"手动配置 Token"的方式，你可以在授权入口处切换"OAuth / 手动"。
:::

## 工作原理

Gridea Pro 的 OAuth 在本地完成标准的 "Authorization Code" 流程，整个过程**不经过 Gridea Pro 的任何服务器**，令牌只会在你的机器、你的浏览器与平台官方服务器之间流转：

```
┌──────────────┐   1. 点击 OAuth    ┌────────────┐
│ Gridea Pro   │ ─────────────────> │ 本地回调服务 │
│ (桌面应用)    │                    │ 127.0.0.1   │
└──────┬───────┘                    └──────┬─────┘
       │ 2. 打开系统默认浏览器               │
       ▼                                   │
┌──────────────┐   3. 登录并授权    ┌──────▼─────┐
│ 平台授权页面   │ <────────────────> │ 平台 API   │
│ (GitHub/Gitee│                    │            │
│  /Netlify等) │   4. 回调带 code   └──────┬─────┘
└──────────────┘ ───────────────────────>  │
                                           │ 5. 用 code 换 access_token
                                           ▼
                                    ┌────────────┐
                                    │ 系统 Keychain│
                                    │ 安全存储    │
                                    └────────────┘
```

详细步骤：

1. 你在"设置 > 网络"某个平台卡片上点击 **OAuth 授权**。
2. Gridea Pro 在本地启动一个一次性 HTTP 服务器，监听 `http://127.0.0.1:<port>/oauth/callback`。
3. Gridea Pro 调用系统默认浏览器打开该平台的授权页面，URL 中包含 `client_id`、`redirect_uri`、`scope`、`state`。
4. 你在浏览器里登录并点击"允许"，平台将浏览器 302 跳回本地回调地址，并带上 `code` 与 `state`。
5. 本地回调服务校验 `state`，然后向平台的 Token 接口用 `code` 换取 `access_token`，再拉取用户信息（昵称、头像、邮箱）。
6. Gridea Pro 把 `access_token` 写入系统级安全存储（见下节），并把用户名、邮箱、头像、推导出的仓库名/域名等**非敏感元数据**写入应用配置。
7. 浏览器窗口显示一张带 Gridea Pro logo 的"授权成功"页面，可以关闭。应用内该平台卡片变为绿色"已连接"状态。

:::note
整个流程中 Gridea Pro 官方没有任何服务器参与。`client_id` 是每个平台 App 的公开标识，`client_secret` 嵌入在桌面端二进制中用于换 Token，这是桌面端 OAuth 的标准做法（参考 RFC 8252）。`access_token` 永远不会上传任何第三方服务器。
:::

### 本地回调端口

不同平台的回调端口策略不同：

| 平台 | 端口策略 | 原因 |
|------|---------|------|
| GitHub | **随机端口**（启动时申请一个空闲端口） | GitHub OAuth App 允许 `http://127.0.0.1` 前缀 + 任意端口 |
| Gitee | **固定 53682** | Gitee 要求回调 URL 与注册时完全一致，不允许任意端口 |
| Netlify | **随机端口** | Netlify 允许回调域名匹配即可 |
| Vercel | **固定 53683** | Vercel Integration 注册时固定了回调路径 |

如果你的操作系统或防火墙占用了 53682 / 53683 端口，Gitee / Vercel 的 OAuth 会失败。此时请关闭占用该端口的其他进程后重试，或改用手动 Token 模式。

### 超时与取消

- **前端超时**：60 秒。点击"OAuth 授权"后如果 60 秒内没有收到回调，按钮会自动恢复，你可以重试。
- **后端超时**：5 分钟。本地 HTTP 服务器在 5 分钟无回调后自动关闭，释放端口。
- **手动取消**：授权过程中可以在应用内点击 **取消**，Gridea Pro 会立即关闭本地服务器并回滚前端状态；也可以直接关闭浏览器选项卡——本地服务最终会因超时自动退出。

### 令牌存储在哪里？

Gridea Pro 把 `access_token` 这类**敏感数据**放进操作系统的凭据存储，**而不是**应用配置文件：

| 系统 | 存储位置 |
|------|---------|
| macOS | **钥匙串（Keychain）**，条目形如 `Gridea Pro - github:token` |
| Windows | **凭据管理器（Credential Manager）** |
| Linux | **Secret Service**（GNOME Keyring / KWallet） |

- 非敏感元数据（用户名、头像 URL、邮箱、仓库名）保存在应用配置文件里，方便 UI 展示。
- 令牌**不会**出现在任何日志、任何导出文件、任何 UI 明文中。
- 令牌**不会**随 Gridea Pro 的数据目录一起同步或备份——换机后需要在新机器上重新授权。

各平台存储 key 命名空间：

| 平台 | Keychain Key |
|------|--------------|
| GitHub | `github:token` |
| Gitee | `gitee:token` |
| Netlify | `netlify:netlifyAccessToken` |
| Vercel | `vercel:token` |

## 取消授权

每个平台的卡片上，授权成功后会出现 **断开连接** 按钮。点击后流程如下：

1. 弹出确认对话框："断开连接后，本机上的凭据将被删除，是否继续？"
2. 确认后 Gridea Pro 会：
   - 从系统 Keychain 删除该平台的令牌条目；
   - 清空应用配置中该平台的用户名、邮箱、头像 URL 等元数据；
   - 平台卡片状态退回"未连接"。
3. 后续如果想继续向该平台部署，可以再次点击"OAuth 授权"走一遍流程。

:::caution
"断开连接"只会删除 **本机** 上的令牌，**不会**在平台方调用 API 吊销这张令牌。如果你担心令牌在其他地方被误用（例如设备丢失），请**同时到平台官网撤销 Gridea Pro 的授权**：

- **GitHub**：<https://github.com/settings/applications> → 找到 Gridea Pro → **Revoke**
- **Gitee**：<https://gitee.com/profile/applications> → "第三方应用" → 取消授权
- **Netlify**：<https://app.netlify.com/user/applications> → "Authorized applications" → Revoke
- **Vercel**：<https://vercel.com/dashboard/integrations> → Gridea Pro → Configure → **Remove Integration**

双边撤销后，即使之前的令牌被泄露也无法再调用任何 API。
:::

## 两种模式如何切换？

- **未连接** 状态：卡片同时显示"OAuth 授权"（主按钮）与"手动配置"（次按钮）。
- **OAuth 已连接** 状态：显示用户头像 + 绿色"已连接 · OAuth"徽标，按钮变为"断开连接"。
- **手动 Token 已保存** 状态：显示黄色"已配置 · 手动"徽标，按钮为"编辑"和"改用 OAuth 授权"——点击后者会弹出 OAuth 流程，成功后自动替换掉原有手动配置。

从手动切回 OAuth、从 OAuth 切回手动都不会丢失其他平台的配置；切换只影响当前选中平台的这一段凭据。

## 安全须知

1. **不要把 Gridea Pro 运行在多人共享的账户里**。令牌虽然存于系统 Keychain，但只要能登录该系统账户就能被读取。
2. **换机/重装后需要重新授权**。由于令牌不跟随数据目录迁移，把 `~/Documents/Gridea` 拷到新机器后需要再走一次 OAuth。
3. **定期检查平台方的已授权应用列表**。这是发现令牌异常使用的最有效办法。
4. **不要把 `access_token` 贴到任何 issue / 截图 / 日志里**。如果不慎泄露，请立即在平台侧撤销并重新授权。

## 常见问题

**浏览器打开授权页后一直白屏 / 无法跳回应用？**
多半是本地端口被占用。对于 Gitee / Vercel，请确认 53682 / 53683 没有被 Charles、VPN 客户端、Docker 容器等占用。GitHub / Netlify 使用随机端口，一般不会冲突。

**授权成功但仓库没有自动创建？**
只有 GitHub 和 Gitee 支持"授权后自动建仓"，且只在 `{username}.github.io` / `{username}` 仓库不存在时才会创建。如果你希望用其他仓库名，请先去平台手动创建，然后在 Gridea Pro 中修改仓库字段后再同步。

**断开连接后别的设备上的 Gridea Pro 还能推送吗？**
能——因为令牌是存在各自操作系统的 Keychain 中的，断开只影响本机。若要彻底吊销，请参考上面的"同时在平台官网撤销"。

**OAuth 和手动 Token 推送权限有区别吗？**
没有。两种方式最终都是用 `access_token` 调 Git 推送 / REST API，权限完全一致。OAuth 的优势只是省去"去官网创建 Token、勾选 scope、复制粘贴"的步骤，并能自动回填配置。

---

下一步，前往对应平台的部署文档查看完整操作截图与字段说明：

- [GitHub Pages 部署](./github-pages/)
- [Gitee Pages 部署](./gitee/)
- [Netlify 部署](./netlify/)
- [Vercel 部署](./vercel/)
