---
title: SEO 设置
description: 配置 Sitemap、RSS Feed、Open Graph、结构化数据和统计分析，提升博客的搜索引擎可见性。
---

Gridea Pro 提供了一站式的 SEO 配置，帮助你的博客获得更好的搜索引擎排名和社交媒体展示效果。

## SEO 配置项

在 **设置** 页面中找到 SEO 配置区域，可以设置以下内容：

### 基本元数据

| 配置项 | 说明 | 示例 |
|--------|------|------|
| 站点标题 | 显示在搜索结果中的标题 | `我的技术博客` |
| 元描述 | 搜索结果中的描述文字 | `分享前端开发和架构设计经验` |
| 关键词 | 站点关键词 | `前端, JavaScript, Vue` |
| 作者 | 默认作者名称 | `张三` |
| 站点 URL | 用于生成绝对链接 | `https://blog.example.com` |

:::caution
**站点 URL** 必须正确配置，它影响 Sitemap、RSS Feed 和 Open Graph 中的所有链接生成。
:::

### 自定义代码注入

- **自定义 Head 代码** — 注入到 `<head>` 标签中，适合添加验证代码、自定义样式等
- **自定义 Body 代码** — 注入到 `<body>` 标签底部，适合添加统计脚本等

## 自动生成的 SEO 文件

每次渲染时，Gridea Pro 会自动生成以下文件：

### Sitemap（站点地图）

自动生成 `sitemap.xml`，包含：
- 所有已发布文章的 URL
- 最后修改时间
- 图片元数据
- 更新频率提示

将 Sitemap 提交到 Google Search Console 和百度站长平台可以加快收录。

### RSS / Atom Feed

自动生成 RSS 和 Atom 格式的订阅源：
- 支持全文输出或仅摘要
- 在 SEO 设置中可切换 Feed 内容模式
- 读者可通过 RSS 阅读器订阅你的博客

### robots.txt

自动生成 `robots.txt`，包含：
- 搜索引擎爬取规则
- Sitemap 文件位置引用

## 社交媒体优化

### Open Graph

Gridea Pro 自动为每篇文章生成 Open Graph 标签，确保在社交平台分享时显示丰富的预览卡片：

- `og:title` — 文章标题
- `og:description` — 文章描述或摘要
- `og:image` — 特色图片
- `og:url` — 文章链接

### Twitter Card

同时生成 Twitter Card 标签，优化在 Twitter/X 上的分享效果。

### JSON-LD 结构化数据

生成 schema.org 格式的结构化数据，帮助搜索引擎更好地理解页面内容类型。

## 统计分析

Gridea Pro 内置对两大统计平台的支持：

### Google Analytics

1. 在 SEO 设置中填入 **Google Analytics 跟踪 ID**（格式如 `G-XXXXXXXXXX`）
2. 保存后，统计代码会自动注入到所有页面

### 百度统计

1. 在 SEO 设置中填入 **百度统计代码**
2. 保存后自动生效

### Google Search Console

在 SEO 设置中填入验证代码，用于验证站点所有权。

:::tip
你也可以通过「自定义 Head 代码」注入来接入其他统计服务（如 Umami、Plausible 等）。
:::

## 文章级 SEO

除了全站 SEO 设置，每篇文章也支持独立的 SEO 配置：

- **自定义描述** — 覆盖自动摘要
- **关键词标签** — 通过标签系统实现
- **特色图片** — 用作 Open Graph 图片
- **自定义 URL Slug** — 生成友好的永久链接

## SEO 最佳实践

1. **填写完整的元数据** — 站点标题、描述、URL 缺一不可
2. **每篇文章写描述** — 自定义描述比自动截取更有效
3. **使用有意义的 Slug** — 利用 [AI 助手](/docs/features/ai-assistant) 生成英文 Slug
4. **添加特色图片** — 社交分享时有图片的链接点击率更高
5. **提交 Sitemap** — 主动提交到搜索引擎加快收录
6. **保持更新频率** — 定期发布内容有助于搜索排名
