---
title: 基础配置
description: 配置 Gridea Pro 的站点信息、远程仓库连接和主题选择，让博客准备就绪。
---

首次启动 Gridea Pro 后，你需要完成几项基础配置，包括站点信息、远程仓库和主题选择。

## 站点信息

在 Gridea Pro 侧边栏点击 **设置**，进入"基础设置"面板：

| 配置项 | 说明 | 示例 |
|--------|------|------|
| 站点名称 | 博客的显示名称 | `我的技术博客` |
| 站点描述 | 一句话介绍，用于 SEO | `记录编程学习与思考` |
| 头像 | 博主头像图片 | 上传或输入 URL |
| 站点域名 | 博客的访问地址 | `https://blog.example.com` |

:::tip
站点域名对应模板变量 `config.domain`，务必包含协议头（`https://`）且不要加尾部斜杠。这个值会直接用于生成 RSS、Open Graph 等元信息中的绝对链接。
:::

## 远程仓库配置

Gridea Pro 通过 Git / 平台 API 将生成的静态文件推送到远程托管服务。在 **设置 > 网络** 中，每个平台都是一张独立的卡片，你可以在同一个应用里同时配置多个平台。

### OAuth 一键授权（推荐）

GitHub、Gitee、Netlify、Vercel **四个平台都支持 OAuth 一键授权**——不需要去平台后台创建 Token、不需要记忆 scope，点击卡片上的 **OAuth 授权** 即可完成登录、令牌获取、仓库创建和配置回填。

授权流程大致是：

1. Gridea Pro 在本地 `127.0.0.1` 启动一次性回调服务。
2. 用系统默认浏览器打开平台的授权页面。
3. 你登录并点 **同意授权**，平台把浏览器跳回本地回调。
4. Gridea Pro 用回调参数换取 `access_token`，并将其写入系统 Keychain（macOS）、凭据管理器（Windows）或 Secret Service（Linux）。
5. 用户名、邮箱、头像、仓库名、域名等会自动回填到卡片上。

每个平台的具体差异（固定端口 vs 随机端口、是否自动建仓、哪些字段需要手填、如何取消授权等）请参见 [OAuth 授权总览](/docs/deployment/oauth/) 以及对应平台的部署文档：

- [GitHub Pages OAuth 授权](/docs/deployment/github-pages/#使用-oauth-授权推荐)
- [Gitee Pages OAuth 授权](/docs/deployment/gitee/#使用-oauth-授权推荐)
- [Netlify OAuth 授权](/docs/deployment/netlify/#使用-oauth-授权)
- [Vercel OAuth 授权](/docs/deployment/vercel/#使用-oauth-授权)

### 手动配置 Token

如果所在网络无法完成 OAuth 流程（例如回调端口被占用、无法打开平台登录页）或者需要推送到**私有仓库**，可以在卡片上点击 **手动配置**，填写：

1. **仓库地址** — 格式如 `https://github.com/<用户名>/<仓库>`
2. **分支** — 通常为 `main`（GitHub）或 `master`（Gitee）
3. **用户名 / 邮箱** — 作为 Git 提交的 author
4. **Token** — 从平台后台生成的个人访问令牌

#### GitHub 手动配置示例

```
平台: GitHub
仓库: https://github.com/username/username.github.io
分支: main
Token: ghp_xxxxxxxxxxxxxxxxxxxx
域名: https://username.github.io
```

:::caution
GitHub Personal Access Token 需要勾选 `repo` 权限。Token 仅在创建时显示一次，请妥善保存。手动配置的 Token 同样会被 Gridea Pro 存入系统 Keychain，不会以明文写进配置文件。
:::

:::tip
手动配置之后，卡片状态会显示为"已配置 · 手动"。随时可以点 **改用 OAuth 授权** 一键升级到 OAuth 模式——升级过程会覆盖原有的 Token，但不会删除仓库内容。
:::

## 导航菜单

在 **设置 > 菜单** 中管理导航链接。每个菜单项对应模板变量中的 `menu.name` 和 `menu.link`。

推荐配置以下基础菜单：

- 首页 -- `/`
- 归档 -- `/archives`
- 标签 -- `/tags`
- 关于 -- `/about`

## 主题选择

在 **设置 > 主题** 中浏览和切换主题。Gridea Pro 内置了几款默认主题，你也可以安装社区主题。

每个主题可能有独立的配置选项（通过 `theme_config` 在模板中访问），切换主题后请检查主题设置面板，根据需要调整颜色、布局等选项。

:::note
主题配置与站点配置是独立的。`config` 对象存放站点级信息（域名、名称等），`theme_config` 存放主题自定义选项（主题色、布局开关等）。详见[模板变量参考](/reference/template-variables/)。
:::

## 数据存储位置

Gridea Pro 的所有数据存储在本地：

| 平台 | 默认路径 |
|------|----------|
| macOS | `~/Documents/Gridea` |
| Windows | `C:\Users\<用户名>\Documents\Gridea` |
| Linux | `~/Documents/Gridea` |

该目录包含文章源文件、主题、图片和配置数据。建议定期备份此目录。

完成配置后，前往[写第一篇文章](./first-post/)开始创作。
