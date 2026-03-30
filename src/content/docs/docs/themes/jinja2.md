---
title: Jinja2 (Pongo2) 指南
description: 使用 Jinja2 (Pongo2) 引擎开发 Gridea Pro 主题的完整指南，包含与标准 Jinja2 的关键差异和避坑要点。
---

Pongo2 是 Jinja2 的 Go 语言实现，与 Python Jinja2 约 90% 兼容。然而，剩余 10% 的差异正是导致大部分渲染错误的原因。本指南帮助你规避所有已知陷阱。

## 引擎声明

在 `config.json` 中设置：

```json
{
  "templateEngine": "jinja2"
}
```

## 基础语法

### 变量输出

```jinja2
{# 自动转义 HTML #}
{{ config.siteName }}

{# 输出原始 HTML（必须用于富文本内容） #}
{{ post.content|safe }}

{# 带默认值 -- 注意冒号语法 #}
{{ post.feature|default:"/images/fallback.jpg" }}
```

### 模板继承

```jinja2
{# base.html #}
<!DOCTYPE html>
<html>
<head><title>{% block title %}{{ config.siteName }}{% endblock %}</title></head>
<body>
  {% include "partials/header.html" %}
  {% block content %}{% endblock %}
  {% include "partials/footer.html" %}
</body>
</html>

{# index.html #}
{% extends "base.html" %}
{% block title %}首页 | {{ config.siteName }}{% endblock %}
{% block content %}
  {% for post in posts %}
    <h2><a href="{{ post.link }}">{{ post.title }}</a></h2>
  {% endfor %}
{% endblock %}
```

### 循环与索引

```jinja2
{% for post in posts %}
  {# forloop.Counter 从 1 开始，forloop.Counter0 从 0 开始 #}
  <span>{{ forloop.Counter }}. {{ post.title }}</span>
{% endfor %}
```

:::danger
Pongo2 使用 `forloop.Counter0` 获取从零开始的索引，而非标准 Jinja2 的 `loop.index0`。使用 `loop.index0` 不会报错但会输出空值，这是最隐蔽的 bug 之一。
:::

## Pongo2 与标准 Jinja2 的关键差异

以下差异会直接导致渲染失败或输出错误：

### 1. 过滤器参数用冒号，不用括号

```jinja2
{# 正确 #}
{{ value|default:"fallback" }}
{{ name|truncatechars:20 }}

{# 错误 -- 会导致解析报错 #}
{{ value|default("fallback") }}
```

### 2. post.date 是字符串，不是时间对象

```jinja2
{# 正确 -- 直接输出 #}
<time>{{ post.date }}</time>

{# 错误 -- post.date 不是 time.Time，会报错 #}
<time>{{ post.date|date:"2006-01-02" }}</time>
```

:::caution
`now` 变量是 Go 的 `time.Time` 对象，可以使用 `|date` 过滤器。但 `post.date` 已是格式化后的字符串，二者类型不同。
:::

### 3. include 路径相对于 templates/ 根目录

```jinja2
{# 正确 -- 始终从 templates/ 开始 #}
{% include "partials/header.html" %}

{# 错误 -- 不是相对于当前文件 #}
{% include "../partials/header.html" %}
```

### 4. 所有标签必须写在同一行

```jinja2
{# 正确 #}
{% if post.isTop %}<span>置顶</span>{% endif %}

{# 也正确 -- 标签本身在一行内 #}
{% if post.isTop %}
  <span>置顶</span>
{% endif %}
```

## 常用模式

### 文章列表（含空状态）

```jinja2
{% if posts %}
  {% for post in posts %}
    <article>
      {% if post.feature %}
        <img src="{{ post.feature }}" alt="{{ post.title }}" />
      {% endif %}
      <h2><a href="{{ post.link }}">{{ post.title }}</a></h2>
      <time>{{ post.date }}</time>
      {% for tag in post.tags %}
        <a href="{{ tag.link }}">{{ tag.name }}</a>
      {% endfor %}
    </article>
  {% endfor %}
{% else %}
  <p>暂无文章</p>
{% endif %}
```

### 分页导航

```jinja2
<nav>
  {% if pagination.prev %}
    <a href="{{ pagination.prev }}">上一页</a>
  {% endif %}
  {% if pagination.next %}
    <a href="{{ pagination.next }}">下一页</a>
  {% endif %}
</nav>
```

### 访问主题配置

```jinja2
<style>:root { --primary: {{ theme_config.primaryColor }}; }</style>

{% if theme_config.showSidebar %}
  {% include "partials/sidebar.html" %}
{% endif %}

{# 注入自定义代码时必须用 safe #}
{{ theme_config.headerScript|safe }}
```

完整变量列表请查阅[模板变量参考](./variables/)。
