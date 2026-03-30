---
title: 模板变量参考
description: Gridea Pro 主题开发中所有可用模板变量的快速参考，包含全局变量、Post 对象、Tag 对象和各页面变量表。
---

本页是模板变量的快速参考。完整详细版本请查阅 [API 参考 > 模板变量表](/reference/template-variables/)。

:::tip
渲染出错 80% 的原因是变量名拼写错误。编写模板前，务必对照本页确认变量名。
:::

## 全局变量

以下变量在所有页面模板中可用：

| 变量 | 类型 | 说明 |
|------|------|------|
| `config.domain` | string | 站点域名（含协议头，无尾部斜杠） |
| `config.siteName` | string | 站点名称 |
| `config.siteDescription` | string | 站点描述 |
| `config.avatar` | string | 头像路径 |
| `config.logo` | string | Logo 路径 |
| `theme_config` | Object | 主题自定义配置（来自 config.json 的 customConfig） |
| `menus` | []Menu | 导航菜单列表 |
| `tags` | []Tag | 所有标签列表 |
| `now` | time.Time | 当前时间 |

:::caution
`config` 是站点级配置，`theme_config` 是主题自定义配置。二者是不同的对象，切勿混用。在模板中访问主题自定义项时必须用 `theme_config.xxx`。
:::

## Post 对象

| 字段 | 类型 | 说明 |
|------|------|------|
| `post.title` | string | 文章标题 |
| `post.content` | string | 渲染后的 HTML 内容 |
| `post.date` | string | 发布日期（已格式化的字符串） |
| `post.dateFormat` | string | 格式化后的日期显示 |
| `post.link` | string | 文章 URL 路径 |
| `post.tags` | []Tag | 文章标签列表 |
| `post.feature` | string | 特色图片 URL（无图时为空字符串） |
| `post.isTop` | bool | 是否置顶 |
| `post.hideInList` | bool | 是否在列表中隐藏 |

## 易错变量速查

| 错误写法 | 正确写法 | 说明 |
|----------|----------|------|
| `post.url` | `post.link` | 字段名为 link |
| `post.image` | `post.feature` | 特色图片字段名为 feature |
| `post.pinned` | `post.isTop` | 置顶字段名为 isTop |
| `post.created_at` | `post.date` | 日期字段名为 date |
| `config.title` | `config.siteName` | 站点名称字段为 siteName |
| `config.url` | `config.domain` | 域名字段为 domain |
| `tag.slug` | `tag.link` | 标签链接字段为 link |
| `tag.posts_count` | `tag.count` | 文章计数字段为 count |
| `pagination.previous` | `pagination.prev` | 上一页简写为 prev |

## 各页面可用变量

| 页面模板 | 专属变量 |
|----------|----------|
| `index.html` | posts, pagination |
| `post.html` | post（单个对象） |
| `archives.html` | posts |
| `tag.html` | posts, tag, current_tag |
| `tags.html` | 仅全局变量 |
| `blog.html` | posts, pagination |
| `memos.html` | memos |
| `404.html` | 仅 config, theme_config, menus, now |

## 三引擎语法对照

| 操作 | Jinja2 (Pongo2) | Go Templates | EJS |
|------|-----------------|-------------|-----|
| 输出变量 | `{{ config.siteName }}` | `{{ .Config.SiteName }}` | `<%= config.siteName %>` |
| 输出 HTML | `{{ post.content\|safe }}` | `{{ .Post.Content }}` | `<%- post.content %>` |
| 条件 | `{% if x %}...{% endif %}` | `{{ if .X }}...{{ end }}` | `<% if (x) { %>...<% } %>` |
| 循环 | `{% for p in posts %}` | `{{ range .Posts }}` | `<% posts.forEach(function(p) { %>` |
| 引入 | `{% include "partials/x.html" %}` | `{{ template "x" . }}` | `<%- include('partials/x') %>` |

详细的三引擎语法差异请查阅各引擎专属指南：[Jinja2](./jinja2/)、[Go Templates](./go-templates/)、[EJS](./ejs/)。
