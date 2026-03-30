---
title: 主题配置 Schema
description: Gridea Pro 主题 config.json 的完整格式规范，包括元信息字段、customConfig 类型定义和 GUI 面板生成规则。
---

`config.json` 是主题与 Gridea Pro 之间的契约文件。它定义主题元信息、声明模板引擎，并通过 `customConfig` 数组自动生成 GUI 设置面板。

## 顶层字段

```json
{
  "name": "my-theme",
  "version": "1.0.0",
  "author": "作者名",
  "description": "主题简短描述",
  "templateEngine": "jinja2",
  "customConfig": []
}
```

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 主题唯一标识符，英文短横线命名 |
| `version` | string | 推荐 | 语义化版本号 |
| `author` | string | 推荐 | 作者名称 |
| `description` | string | 推荐 | 显示在主题选择界面的描述 |
| `templateEngine` | string | 推荐 | `"jinja2"` / `"go"` / `"ejs"`，未声明默认 `"ejs"` |
| `customConfig` | array | 否 | 自定义配置项数组 |

:::caution
`name` 字段是主题的唯一标识符，不要包含空格或中文。无 `config.json` 文件的目录不会被 Gridea Pro 识别为合法主题。
:::

## customConfig 配置项

每个配置项会在 GUI 设置面板中渲染为对应的表单控件：

```json
{
  "name": "primaryColor",
  "label": "主题色",
  "group": "外观设置",
  "type": "color",
  "value": "#6366f1",
  "note": "链接、按钮等元素的主要颜色"
}
```

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 字段标识符，模板中通过 `theme_config.<name>` 访问，使用 camelCase |
| `label` | string | 是 | GUI 面板中显示的标签文字 |
| `group` | string | 否 | 分组名称，相同 group 的项归入同一折叠面板 |
| `type` | string | 是 | 配置类型，决定渲染的 GUI 控件 |
| `value` | varies | 是 | 默认值 |
| `note` | string | 否 | 帮助说明文字 |
| `options` | array | 条件 | 仅 `select` 类型必需 |

## 支持的类型

| type | GUI 控件 | 值类型 | 适用场景 |
|------|----------|--------|----------|
| `input` | 单行输入框 | string | 标题、链接、短文本 |
| `textarea` | 多行文本域 | string | 长文本、自定义 CSS |
| `color` | 颜色选择器 | string | 十六进制颜色码 |
| `boolean` | 开关 | boolean | 功能开关 |
| `number` | 数字输入框 | number | 每页文章数等数值 |
| `select` | 下拉选择 | string | 布局风格、字体选择 |
| `image` | 图片上传 | string | 横幅图、背景图 |
| `code` | 代码编辑器 | string | 自定义 JS/CSS 注入 |
| `array` | 可增删列表 | array | 社交链接等重复项 |

### select 类型示例

```json
{
  "name": "headerStyle",
  "label": "顶栏样式",
  "group": "布局设置",
  "type": "select",
  "value": "fixed",
  "options": [
    { "label": "固定顶部", "value": "fixed" },
    { "label": "跟随滚动", "value": "static" },
    { "label": "透明悬浮", "value": "transparent" }
  ]
}
```

## 分组机制

使用 `group` 字段将配置项组织成逻辑分组：

| 推荐分组 | 包含内容 |
|----------|----------|
| 基础设置 | 副标题、每页文章数、日期格式 |
| 外观设置 | 主题色、强调色、横幅图 |
| 布局设置 | 侧边栏开关、顶栏样式、内容宽度 |
| 社交设置 | 社交链接、GitHub 用户名 |
| 高级设置 | 自定义 CSS、代码注入 |

## 在模板中访问

```jinja2
{# Jinja2 #}
{{ theme_config.primaryColor }}
{% if theme_config.showSidebar %}...{% endif %}
{{ theme_config.headerScript|safe }}
```

```go-template
{{/* Go Templates */}}
{{ .ThemeConfig.primaryColor }}
{{ if .ThemeConfig.showSidebar }}...{{ end }}
```

```ejs
<!-- EJS -->
<%= theme_config.primaryColor %>
<% if (theme_config.showSidebar) { %>...<% } %>
```

:::tip
`code` 和 `textarea` 类型的值若包含 HTML/JS，在 Jinja2 中输出时必须加 `|safe` 过滤器，否则会被转义为纯文本。详见 [Jinja2 指南](./jinja2/)。
:::

## 最佳实践

1. **提供合理默认值** -- 用户安装后应开箱即用
2. **name 使用 camelCase** -- `primaryColor` 而非 `primary-color`
3. **不与内置变量冲突** -- 不要用 `siteName`、`domain` 等已被 `config` 占用的名称
4. **5 个以上配置项必须分组** -- 保持 GUI 面板的可读性
5. **高级设置放最后** -- 普通用户很少需要修改
