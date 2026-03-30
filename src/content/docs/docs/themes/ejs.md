---
title: EJS 指南
description: Gridea Pro 中 EJS 模板引擎的使用指南，主要用于旧版主题兼容，新主题建议使用 Jinja2。
---

:::caution
EJS 引擎主要用于兼容旧版 Gridea 主题。**新主题强烈推荐使用 [Jinja2 (Pongo2)](./jinja2/)**，它拥有更强大的模板继承、更丰富的过滤器和更安全的沙箱环境。
:::

## 引擎声明

```json
{
  "templateEngine": "ejs"
}
```

如果 `config.json` 中未声明 `templateEngine`，默认使用 EJS（为旧版兼容）。

## 基础语法

### 输出标签

EJS 有三种核心输出方式：

```ejs
<% /* 执行代码，不输出 */ %>
<%= value %>   <%# 转义输出：HTML 会被转义 %>
<%- value %>   <%# 原始输出：直接输出 HTML %>
```

### 变量访问

EJS 使用 camelCase 命名，与 Jinja2 一致：

```ejs
<h1><%= config.siteName %></h1>
<p><%= config.siteDescription %></p>

<%# 文章内容是 HTML，必须用 <%- 原始输出 %>
<%- post.content %>

<%# 主题配置 %>
<%= theme_config.primaryColor %>
```

### 循环

```ejs
<% posts.forEach(function(post) { %>
  <article>
    <h2><a href="<%= post.link %>"><%= post.title %></a></h2>
    <time><%= post.date %></time>
  </article>
<% }); %>
```

### 条件判断

```ejs
<% if (post.feature) { %>
  <img src="<%= post.feature %>" alt="<%= post.title %>">
<% } %>

<% if (posts.length > 0) { %>
  <%# 显示文章列表 %>
<% } else { %>
  <p>暂无文章</p>
<% } %>
```

### 引入局部模板

```ejs
<%- include('partials/header') %>
<main>内容区域</main>
<%- include('partials/footer') %>

<%# 传递数据给局部模板 %>
<%- include('partials/head', { title: post.title }) %>
```

:::note
EJS 没有原生的模板继承（extends/block），只能通过 `include` 拆分组件来复用代码。这也是推荐新主题使用 Jinja2 的原因之一。
:::

## 关键限制

### 禁止使用 require()

Gridea Pro 中的 EJS 运行时不支持 Node.js 的 `require()` 函数。你无法引入外部 npm 包或自定义模块：

```ejs
<%# 错误 -- 会报运行时错误 %>
<% var moment = require('moment'); %>

<%# 正确 -- 使用原生 JavaScript %>
<% var year = new Date().getFullYear(); %>
```

### post.date 是字符串

与其他引擎一致，`post.date` 已是格式化后的字符串：

```ejs
<%# 正确 %>
<time><%= post.date %></time>

<%# 不必要 -- date 已经格式化 %>
<time><%= new Date(post.date).toLocaleDateString() %></time>
```

## 迁移到 Jinja2

如果你正在维护旧版 EJS 主题，建议逐步迁移到 Jinja2。核心对照：

| EJS | Jinja2 (Pongo2) |
|-----|-----------------|
| `<%= value %>` | `{{ value }}` |
| `<%- html %>` | `{{ html\|safe }}` |
| `<% if (x) { %>` | `{% if x %}` |
| `<% } %>` | `{% endif %}` |
| `<% arr.forEach(function(item) { %>` | `{% for item in arr %}` |
| `<% }); %>` | `{% endfor %}` |
| `<%- include('partials/x') %>` | `{% include "partials/x.html" %}` |
| 无 | `{% extends "base.html" %}` |

迁移步骤：

1. 将 `config.json` 中 `templateEngine` 改为 `"jinja2"`
2. 逐个文件转换语法
3. 将 `include` 组装升级为 `extends` + `block` 继承
4. 使用预览功能验证每个页面

完整变量列表请查阅[模板变量参考](./variables/)。
