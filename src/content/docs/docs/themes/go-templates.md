---
title: Go Templates 指南
description: 使用 Go Templates 引擎开发 Gridea Pro 主题，涵盖 PascalCase 变量名、nil 防护、CustomConfig map 访问和 safeHTML。
---

Go Templates 是 Go 标准库自带的模板引擎，适合熟悉 Go 语言或从 Hugo 迁移的开发者。在 Gridea Pro 中使用 `html/template` 包，默认对输出进行 HTML 转义。

## 引擎声明

```json
{
  "templateEngine": "go"
}
```

## 核心规则：PascalCase 变量名

Go Templates 中所有变量名必须使用 **PascalCase**（大驼峰），这与 Jinja2/EJS 的 camelCase 完全不同：

| Go Templates | Jinja2 / EJS |
|-------------|--------------|
| `.Config.SiteName` | `config.siteName` |
| `.Config.Domain` | `config.domain` |
| `.Post.Title` | `post.title` |
| `.Post.Content` | `post.content` |
| `.Posts` | `posts` |
| `.Tags` | `tags` |
| `.Menus` | `menus` |
| `.Pagination.Prev` | `pagination.prev` |

:::danger
大小写写错不会报错，只会输出空值或 `<no value>`。这是 Go Templates 中最常见的沉默错误，排查极其困难。务必严格使用 PascalCase。
:::

## 基础语法

### 变量输出

```go-template
<h1>{{ .Config.SiteName }}</h1>
<p>{{ .Config.SiteDescription }}</p>

{{/* 文章内容已标记为 template.HTML，不会被二次转义 */}}
<article>{{ .Post.Content }}</article>
```

### 条件判断

```go-template
{{ if .Post.Feature }}
  <img src="{{ .Post.Feature }}" alt="特色图片">
{{ end }}

{{ if .Posts }}
  <p>共 {{ len .Posts }} 篇文章</p>
{{ else }}
  <p>暂无文章</p>
{{ end }}
```

### 循环

```go-template
{{ range .Posts }}
  <h2><a href="{{ .Link }}">{{ .Title }}</a></h2>
  <time>{{ .Date }}</time>
{{ end }}

{{/* 带索引的循环 */}}
{{ range $index, $post := .Posts }}
  <span>{{ $index }}. {{ $post.Title }}</span>
{{ end }}
```

## 关键避坑点

### 1. 访问嵌套字段前必须判空

```go-template
{{/* 正确 -- 先检查 .Post 是否存在 */}}
{{ if .Post }}
  <h1>{{ .Post.Title }}</h1>
{{ end }}

{{/* 错误 -- 如果 .Post 是 nil，会 panic */}}
<h1>{{ .Post.Title }}</h1>
```

:::caution
在 Go Templates 中，访问 nil 对象的字段会导致渲染 panic 并中断构建。每个可能为空的嵌套对象访问前都必须先用 `{{ if }}` 判断。
:::

### 2. 没有模板继承

Go Templates **不支持** Jinja2 风格的 `extends` / `block`。替代方案是使用 `define` + `template` 组合：

```go-template
{{/* partials/header.html */}}
{{ define "header" }}
<header>
  <h1>{{ .Config.SiteName }}</h1>
  <nav>
    {{ range .Menus }}
      <a href="{{ .Link }}">{{ .Name }}</a>
    {{ end }}
  </nav>
</header>
{{ end }}

{{/* index.html -- 完整 HTML 骨架 + template 组装 */}}
<!DOCTYPE html>
<html>
<head><title>{{ .Config.SiteName }}</title></head>
<body>
  {{ template "header" . }}
  <main>
    {{ range .Posts }}
      <h2>{{ .Title }}</h2>
    {{ end }}
  </main>
</body>
</html>
```

:::danger
`{{ template "header" . }}` 末尾的 `.` 绝不可省略！它将当前上下文传递给子模板。漏掉 `.` 会导致子模板中所有变量为 nil。
:::

### 3. CustomConfig 是 map，必须用 index 访问

`theme_config` 在 Go Templates 中是 `.ThemeConfig`，它是一个 `map[string]interface{}` 类型：

```go-template
{{/* 正确 -- 使用 index 函数访问 map */}}
{{ index .Site.CustomConfig "showSearch" }}

{{/* 在 Gridea Pro 中 ThemeConfig 可以直接用点号 */}}
{{ .ThemeConfig.primaryColor }}
```

### 4. HTML/CSS 内容必须用 safeHTML / safeCSS

```go-template
{{/* 如果 customCss 包含 CSS 代码 */}}
<style>{{ .ThemeConfig.customCss | safeCSS }}</style>

{{/* 如果 headerScript 包含 HTML/JS */}}
{{ .ThemeConfig.headerScript | safeHTML }}
```

## 常用比较函数

Go Templates 的比较运算符是函数形式：

```go-template
{{ if eq .Post.Status "published" }}已发布{{ end }}
{{ if ne .Post.Title "" }}有标题{{ end }}
{{ if gt (len .Posts) 0 }}有文章{{ end }}
{{ if le $index 5 }}前 5 项{{ end }}
```

| 函数 | 含义 |
|------|------|
| `eq` | 等于 |
| `ne` | 不等于 |
| `lt` | 小于 |
| `le` | 小于等于 |
| `gt` | 大于 |
| `ge` | 大于等于 |

完整变量列表请查阅[模板变量参考](./variables/)，从 Jinja2 迁移请参考[Jinja2 指南](./jinja2/)中的语法对照。
