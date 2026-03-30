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

Gridea Pro 通过 Git 将生成的静态文件推送到远程仓库。在 **设置 > 远程** 中配置：

1. **平台** -- 选择 GitHub、Gitee、Coding 或自定义 Git
2. **仓库地址** -- 填写仓库的 HTTPS 或 SSH 地址
3. **分支** -- 通常为 `main` 或 `gh-pages`
4. **Token / 密钥** -- 用于认证的个人访问令牌

### GitHub 配置示例

```
平台: GitHub
仓库: https://github.com/username/username.github.io
分支: main
Token: ghp_xxxxxxxxxxxxxxxxxxxx
域名: https://username.github.io
```

:::caution
GitHub Personal Access Token 需要勾选 `repo` 权限。Token 仅在创建时显示一次，请妥善保存。
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
