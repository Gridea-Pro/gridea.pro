---
title: 评论系统
description: Gridea Pro 集成 7 大评论平台，支持 Gitalk、Giscus、Disqus、Valine、Waline、Twikoo、Cusdis。
---

Gridea Pro 内置了 7 种主流评论系统的集成支持。你可以根据自己的需求和偏好选择合适的评论平台，无需手动修改主题代码。

## 支持的评论平台

| 平台 | 类型 | 数据存储 | 需要后端 | 适用场景 |
|------|------|----------|----------|----------|
| **Gitalk** | GitHub Issue | GitHub | 否 | 技术博客、开发者社区 |
| **Giscus** | GitHub Discussions | GitHub | 否 | 技术博客（推荐） |
| **Disqus** | 第三方服务 | Disqus 云端 | 否 | 国际化博客 |
| **Valine** | LeanCloud | LeanCloud | 否 | 国内博客（简单易用） |
| **Waline** | 自建服务 | 多种数据库 | 是 | 需要完整管理功能 |
| **Twikoo** | 自建服务 | MongoDB/云函数 | 是 | 国内博客（功能丰富） |
| **Cusdis** | 自建服务 | 自托管 | 是 | 轻量、隐私优先 |

## 基本配置

1. 在左侧导航中点击 **设置**
2. 找到 **评论** 配置区域
3. 开启评论功能开关
4. 选择评论平台
5. 填写该平台的配置参数
6. 保存设置

:::tip
切换评论平台时，之前平台的配置不会丢失。你可以随时切换回来。
:::

## 各平台配置详解

### Gitalk

基于 GitHub Issue 的评论系统，需要一个 GitHub OAuth Application。

**配置参数：**
- **GitHub Repository** — 用于存储评论的仓库名称
- **Repository Owner** — 仓库所有者的 GitHub 用户名
- **Client ID** — GitHub OAuth App 的 Client ID
- **Client Secret** — GitHub OAuth App 的 Client Secret
- **Admin** — 仓库管理员的 GitHub 用户名

**设置步骤：**
1. 在 GitHub Settings > Developer settings > OAuth Apps 中创建新应用
2. Homepage URL 填写你的博客地址
3. Authorization callback URL 也填写你的博客地址
4. 将获得的 Client ID 和 Client Secret 填入 Gridea Pro

### Giscus

基于 GitHub Discussions 的评论系统，是 Gitalk 的现代替代方案。

**配置参数：**
- **Repository** — 格式为 `owner/repo`
- **Repository ID** — 仓库 ID
- **Category** — Discussions 分类名称
- **Category ID** — 分类 ID
- **Mapping** — 页面与 Discussion 的映射方式
- **Theme** — 评论区主题样式

**设置步骤：**
1. 在目标仓库中启用 GitHub Discussions
2. 安装 Giscus GitHub App
3. 访问 [giscus.app](https://giscus.app) 获取配置参数
4. 将参数填入 Gridea Pro

:::note
Giscus 相比 Gitalk 有更好的性能和更丰富的功能，推荐新用户优先使用。
:::

### Disqus

老牌第三方评论服务，国际化支持好，但国内访问可能受限。

**配置参数：**
- **Shortname** — Disqus 站点的 shortname

**设置步骤：**
1. 在 [disqus.com](https://disqus.com) 注册并创建站点
2. 记下你的 shortname
3. 填入 Gridea Pro 配置

:::caution
Disqus 在中国大陆可能无法正常加载。如果你的读者主要在国内，建议选择 Valine、Waline 或 Twikoo。
:::

### Valine

基于 LeanCloud 的无后端评论系统，配置简单。

**配置参数：**
- **App ID** — LeanCloud 应用的 App ID
- **App Key** — LeanCloud 应用的 App Key

**设置步骤：**
1. 在 [LeanCloud](https://leancloud.app) 创建应用
2. 在应用设置中获取 App ID 和 App Key
3. 填入 Gridea Pro

### Waline

Valine 的增强版，需要自建后端服务，功能更完整。

**配置参数：**
- **Server URL** — Waline 后端服务地址

**设置步骤：**
1. 按照 [Waline 官方文档](https://waline.js.org) 部署后端服务
2. 推荐使用 Vercel 一键部署
3. 将后端服务地址填入 Gridea Pro

### Twikoo

功能丰富的自建评论系统，支持 Vercel/云函数部署。

**配置参数：**
- **Env ID** — 云环境 ID 或 Vercel 部署地址

**设置步骤：**
1. 按照 [Twikoo 官方文档](https://twikoo.js.org) 部署
2. 支持腾讯云函数、Vercel 等多种部署方式
3. 将环境 ID 或服务地址填入 Gridea Pro

### Cusdis

轻量级、隐私友好的开源评论系统。

**配置参数：**
- **App ID** — Cusdis 应用 ID
- **Host** — Cusdis 服务地址（自托管时需要）

**设置步骤：**
1. 在 [cusdis.com](https://cusdis.com) 注册或自行部署
2. 创建站点并获取 App ID
3. 填入 Gridea Pro

## 评论管理

配置好评论系统后，你可以在 Gridea Pro 中直接管理评论：

- **查看评论** — 在评论页面查看所有文章的评论列表
- **回复评论** — 直接在应用内回复读者评论
- **删除评论** — 删除不当评论
- **分页浏览** — 支持分页查看大量评论

:::note
评论管理功能的可用性取决于所选平台的 API 支持程度。部分平台可能仅支持查看而不支持在应用内回复或删除。
:::

## 主题集成

评论系统的前端渲染由主题负责。Gridea Pro 会将评论配置自动注入到渲染页面中。确保你使用的主题支持所选的评论平台。

内置主题默认支持所有 7 种评论系统。如果使用第三方主题，请查阅主题文档确认支持情况。
