---
title: 常见问题
description: Gridea Pro 使用过程中的常见问题与解答，涵盖安装、使用、主题开发和部署问题。
---

## 安装相关

### Linux 上启动后白屏或崩溃

这通常是缺少 WebKit2GTK 依赖导致的。

**Ubuntu 24.04：**

```bash
sudo apt install libwebkit2gtk-4.1-0t64
```

:::danger
Ubuntu 24.04 中包名为 `libwebkit2gtk-4.1-0t64`，与旧版的 `libwebkit2gtk-4.0-37` 不同。安装错误的包不会报错但无法解决问题。详见[安装指南](/getting-started/installation/)。
:::

**Ubuntu 22.04：**

```bash
sudo apt install libwebkit2gtk-4.0-37
```

### macOS 提示"已损坏，无法打开"

在终端中执行：

```bash
xattr -cr /Applications/Gridea\ Pro.app
```

然后重新打开应用。

### Windows SmartScreen 拦截

点击"更多信息"，然后选择"仍要运行"。这是因为应用尚未进行 Windows 代码签名。

## 使用相关

### 文章预览和实际部署效果不一致

检查以下几点：
1. 站点域名 (`config.domain`) 是否正确配置
2. 静态资源路径是否使用了 `assets/` 前缀（不应该使用，详见[主题系统概述](/themes/)）
3. 是否有依赖绝对路径的资源链接

### 同步部署失败

常见原因和解决方案：

| 错误信息 | 原因 | 解决方案 |
|----------|------|----------|
| 401 Unauthorized | Token 过期或无效 | 重新生成 Token 并更新 |
| 403 Forbidden | Token 权限不足 | 确保 Token 有 `repo` 权限 |
| 远程仓库不存在 | 仓库地址写错 | 核对仓库完整 URL |
| push rejected | 远程有未合并的变更 | 手动解决冲突或强制推送 |

### 图片无法显示

- 确认图片已通过编辑器上传（而非仅插入外部链接）
- 检查图片路径是否正确
- 部署后检查图片文件是否存在于输出目录中

## 主题开发相关

### 模板渲染输出空白或 `<no value>`

**Jinja2：** 最可能是变量名拼写错误。对照[模板变量表](/reference/template-variables/)逐字核对。

**Go Templates：** 变量名必须使用 PascalCase。`.config.siteName` 应为 `.Config.SiteName`。

:::tip
善用[易错变量速查表](/reference/template-variables/#易错变量速查)，它列出了最常见的拼写错误。
:::

### Jinja2 模板报 "filter not found" 错误

Pongo2 的过滤器参数使用冒号语法，不是括号：

```jinja2
{# 正确 #}
{{ value|default:"fallback" }}

{# 错误 -- 会报 filter 解析错误 #}
{{ value|default("fallback") }}
```

### Go Templates 渲染 panic

几乎所有 panic 都是因为访问了 nil 对象的字段。务必在访问嵌套字段前判空：

```go-template
{{ if .Post }}{{ .Post.Title }}{{ end }}
```

### post.date 使用 date 过滤器报错

`post.date` 已经是格式化后的字符串，不是 `time.Time` 对象。直接输出即可：

```jinja2
{# 正确 #}
{{ post.date }}

{# 错误 #}
{{ post.date|date:"2006-01-02" }}
```

只有 `now` 变量是 `time.Time` 对象，可以使用 `|date` 过滤器。

### 自定义 CSS/JS 被转义为纯文本

在 Jinja2 中输出 HTML/CSS/JS 内容时必须使用 `|safe` 过滤器：

```jinja2
{{ theme_config.customCss|safe }}
{{ theme_config.headerScript|safe }}
```

在 Go Templates 中使用 `safeHTML` 或 `safeCSS` 函数。

## 部署相关

### GitHub Pages 部署后 CSS 样式丢失

如果使用 `<用户名>.github.io/<仓库名>/` 形式的地址，需要确保站点域名配置中包含仓库名路径，或在模板中使用相对路径引用资源。

### Vercel/Netlify 部署后 404

确认 Build Command 留空，Publish Directory 设置为 `.`（根目录），因为 Gridea Pro 已经生成了完整的静态文件。

---

如果以上内容未能解决你的问题，请在 [GitHub Issues](https://github.com/getgridea/gridea-pro/issues) 中提交反馈。
