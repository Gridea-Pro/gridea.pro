---
title: 完整模板变量表
description: Gridea Pro 所有模板变量的完整技术参考，包含每个字段的类型、说明和三引擎访问语法。
---

:::caution
渲染出错 80% 的原因是变量名拼写错误。请将此页面加入书签，编写模板前务必对照核实。
:::

## 全局变量

以下变量在**所有页面模板**中可用。

### config 对象 -- 站点级配置

| 字段 | 类型 | Jinja2 | Go Templates | EJS |
|------|------|--------|-------------|-----|
| 域名 | string | `config.domain` | `.Config.Domain` | `config.domain` |
| 站点名称 | string | `config.siteName` | `.Config.SiteName` | `config.siteName` |
| 站点描述 | string | `config.siteDescription` | `.Config.SiteDescription` | `config.siteDescription` |
| 头像 | string | `config.avatar` | `.Config.Avatar` | `config.avatar` |
| Logo | string | `config.logo` | `.Config.Logo` | `config.logo` |

### theme_config 对象 -- 主题自定义配置

通过 config.json 的 `customConfig` 数组声明，在 GUI 中由用户设置：

| 引擎 | 访问方式 | 示例 |
|------|----------|------|
| Jinja2 | `theme_config.<name>` | `theme_config.primaryColor` |
| Go Templates | `.ThemeConfig.<name>` | `.ThemeConfig.primaryColor` |
| EJS | `theme_config.<name>` | `theme_config.primaryColor` |

### 其他全局变量

| 变量 | 类型 | 说明 |
|------|------|------|
| `menus` / `.Menus` | []Menu | 导航菜单列表 |
| `tags` / `.Tags` | []Tag | 所有标签列表 |
| `now` / `.Now` | time.Time | 当前时间（Go time.Time 对象） |

## Post 对象

在列表页通过循环 `posts` 获取，在文章详情页通过 `post` 直接访问。

| 字段 | 类型 | Jinja2 | Go Templates | EJS |
|------|------|--------|-------------|-----|
| 标题 | string | `post.title` | `.Post.Title` / `.Title` | `post.title` |
| HTML 内容 | string | `post.content\|safe` | `.Post.Content` | `<%- post.content %>` |
| 发布日期 | string | `post.date` | `.Post.Date` / `.Date` | `post.date` |
| 格式化日期 | string | `post.dateFormat` | `.Post.DateFormat` | `post.dateFormat` |
| 链接 | string | `post.link` | `.Post.Link` / `.Link` | `post.link` |
| 标签列表 | []Tag | `post.tags` | `.Post.Tags` / `.Tags` | `post.tags` |
| 特色图片 | string | `post.feature` | `.Post.Feature` / `.Feature` | `post.feature` |
| 是否置顶 | bool | `post.isTop` | `.Post.IsTop` / `.IsTop` | `post.isTop` |
| 列表中隐藏 | bool | `post.hideInList` | `.Post.HideInList` | `post.hideInList` |
| 文件名 | string | `post.fileName` | `.Post.FileName` | `post.fileName` |

:::danger
`post.content` 是已渲染的 HTML 字符串。Jinja2 中必须用 `|safe` 过滤器输出，EJS 中必须用 `<%-` 而非 `<%=`。Go Templates 中 Content 已标记为 `template.HTML`，不会二次转义。
:::

## Tag 对象

| 字段 | 类型 | Jinja2 | Go Templates | EJS |
|------|------|--------|-------------|-----|
| 名称 | string | `tag.name` | `.Tag.Name` / `.Name` | `tag.name` |
| 链接 | string | `tag.link` | `.Tag.Link` / `.Link` | `tag.link` |
| 文章数 | int | `tag.count` | `.Tag.Count` / `.Count` | `tag.count` |

## Menu 对象

| 字段 | 类型 | Jinja2 | Go Templates | EJS |
|------|------|--------|-------------|-----|
| 名称 | string | `menu.name` | `.Name` | `menu.name` |
| 链接 | string | `menu.link` | `.Link` | `menu.link` |

## Pagination 对象

仅在 `index.html` 和 `blog.html` 中可用。

| 字段 | 类型 | Jinja2 | Go Templates | EJS |
|------|------|--------|-------------|-----|
| 上一页 | string | `pagination.prev` | `.Pagination.Prev` | `pagination.prev` |
| 下一页 | string | `pagination.next` | `.Pagination.Next` | `pagination.next` |

值为空字符串时表示已到达首页/末页。

## Memo 对象

仅在 `memos.html` 中通过 `memos` 列表可用。

| 字段 | 类型 | 说明 |
|------|------|------|
| `memo.content` | string | Memo 内容（HTML） |
| `memo.date` | string | 发布日期 |

## 各页面可用变量矩阵

| 变量 | index | post | archives | tag | tags | about | friends | memos | blog | 404 |
|------|:-----:|:----:|:--------:|:---:|:----:|:-----:|:-------:|:-----:|:----:|:---:|
| config | * | * | * | * | * | * | * | * | * | * |
| theme_config | * | * | * | * | * | * | * | * | * | * |
| menus | * | * | * | * | * | * | * | * | * | * |
| tags | * | * | * | * | * | * | * | * | * | |
| now | * | * | * | * | * | * | * | * | * | * |
| posts | * | | * | * | | | | | * | |
| post | | * | | | | | | | | |
| pagination | * | | | | | | | | * | |
| tag/current_tag | | | | * | | | | | | |
| memos | | | | | | | | * | | |

## 易错变量速查

| 错误写法 | 正确写法 | 说明 |
|----------|----------|------|
| `post.url` | `post.link` | Gridea 用 link 不用 url |
| `post.image` | `post.feature` | 特色图片字段名为 feature |
| `post.pinned` | `post.isTop` | 置顶字段名为 isTop |
| `config.title` | `config.siteName` | 站点名称字段为 siteName |
| `config.url` | `config.domain` | 域名字段为 domain |
| `tag.posts_count` | `tag.count` | 简写为 count |
| `pagination.previous` | `pagination.prev` | 简写为 prev |
| `{{ val\|default("x") }}` | `{{ val\|default:"x" }}` | Pongo2 用冒号不用括号 |
