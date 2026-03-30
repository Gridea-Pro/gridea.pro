---
title: 自定义模板函数
description: Gridea Pro 在三种模板引擎中提供的自定义函数和过滤器参考。
---

除了各模板引擎自带的内置功能外，Gridea Pro 还注入了一组自定义函数和过滤器，用于处理博客场景中的常见需求。

## Jinja2 (Pongo2) 自定义过滤器

### safe

输出原始 HTML，不进行转义。用于渲染文章内容、自定义代码注入等场景。

```jinja2
{{ post.content|safe }}
{{ theme_config.headerScript|safe }}
```

:::danger
仅对可信内容使用 `|safe`。用户输入的内容不应使用此过滤器，以防 XSS 攻击。
:::

### default

为空值提供默认值。注意 Pongo2 使用冒号语法：

```jinja2
{{ post.feature|default:"/images/default-cover.jpg" }}
{{ theme_config.subtitle|default:"" }}
```

### truncatechars

截断字符串到指定长度，自动添加省略号：

```jinja2
{{ post.title|truncatechars:30 }}
{# 输出: "这是一个很长的文章标题这是一..." #}
```

### date

格式化 `time.Time` 对象。使用 Go 的时间格式化参考时间 `2006-01-02 15:04:05`：

```jinja2
{# now 是 time.Time 对象，可以格式化 #}
{{ now|date:"2006-01-02" }}
{{ now|date:"2006年1月2日" }}
```

:::caution
`post.date` 已经是字符串，不能使用 `|date` 过滤器。只有 `now` 变量是 `time.Time` 对象。
:::

### length

获取字符串长度或列表长度：

```jinja2
{{ posts|length }} 篇文章
{{ post.title|length }} 个字符
```

### lower / upper

大小写转换：

```jinja2
{{ tag.name|lower }}
{{ config.siteName|upper }}
```

## Go Templates 自定义函数

### safeHTML

将字符串标记为安全 HTML，防止被 `html/template` 自动转义：

```go-template
{{ .ThemeConfig.headerScript | safeHTML }}
{{ .ThemeConfig.footerHtml | safeHTML }}
```

### safeCSS

将字符串标记为安全 CSS：

```go-template
<style>{{ .ThemeConfig.customCss | safeCSS }}</style>
```

### safeURL

将字符串标记为安全 URL：

```go-template
<a href="{{ .Post.Link | safeURL }}">链接</a>
```

### 内置函数速查

Go Templates 自带的常用函数：

| 函数 | 用法 | 说明 |
|------|------|------|
| `len` | `{{ len .Posts }}` | 获取长度 |
| `index` | `{{ index .Posts 0 }}` | 按索引访问 |
| `printf` | `{{ printf "%d 篇" (len .Posts) }}` | 格式化输出 |
| `eq` / `ne` | `{{ if eq .X "value" }}` | 相等/不等比较 |
| `lt` / `le` / `gt` / `ge` | `{{ if gt (len .Posts) 0 }}` | 数值比较 |
| `and` / `or` / `not` | `{{ if and .X .Y }}` | 逻辑运算 |

:::tip
Go Templates 中访问 map 类型（如 CustomConfig）的值必须使用 `index` 函数：`{{ index .Site.CustomConfig "key" }}`。点号访问法仅适用于 struct 字段。
:::

## EJS 中的函数

EJS 运行在有限的 JavaScript 环境中，可以使用基本的 JavaScript 内置方法：

```ejs
<%# 字符串方法 %>
<%= post.title.substring(0, 30) %>
<%= tag.name.toLowerCase() %>

<%# 数组方法 %>
<%= posts.length %>
<% var topPosts = posts.filter(function(p) { return p.isTop; }); %>

<%# 日期（仅 now 可用） %>
<%= now.Format("2006-01-02") %>
```

:::caution
EJS 环境中不支持 `require()`，无法引入外部模块。可用的 JavaScript 功能限于 ES5 内置方法。
:::

## 跨引擎对照

| 操作 | Jinja2 | Go Templates | EJS |
|------|--------|-------------|-----|
| 安全 HTML 输出 | `\|safe` | `\| safeHTML` 或默认安全 | `<%-` |
| 默认值 | `\|default:"val"` | `{{ if }}...{{ else }}...{{ end }}` | `\|\| 'val'` |
| 字符串截断 | `\|truncatechars:N` | 自定义或 `printf` | `.substring(0, N)` |
| 列表长度 | `\|length` | `len .List` | `.length` |
| 时间格式化 | `\|date:"格式"` | `.Format "格式"` | `.Format("格式")` |
