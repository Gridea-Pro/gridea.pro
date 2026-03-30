---
title: 主题系统概述
description: 了解 Gridea Pro 的三引擎主题架构（Jinja2/Pongo2、Go Templates、EJS），掌握主题目录结构和开发流程。
---

Gridea Pro 的主题系统是其最强大的特性之一，支持 **Jinja2 (Pongo2)**、**Go Templates** 和 **EJS** 三种模板引擎，让不同技术背景的开发者都能轻松创建主题。

## 三引擎架构

| 引擎 | config.json 中的值 | 推荐场景 | 特点 |
|------|-------------------|----------|------|
| Jinja2 (Pongo2) | `"jinja2"` | 新主题开发（默认推荐） | 语法直觉、模板继承优雅、跨语言通用 |
| Go Templates | `"go"` | 从 Hugo 迁移 / 熟悉 Go | 与后端语言一致、性能优异 |
| EJS | `"ejs"` | 旧版主题兼容 | 主要用于向后兼容，新主题不推荐 |

:::tip
不确定该选哪个引擎？选 Jinja2。它是 Gridea Pro 的默认推荐引擎，语法对前端和后端开发者都很友好。
:::

## 主题目录结构

```
themes/my-theme/
├── config.json              # 主题配置声明（必需）
├── templates/               # 模板文件（必需）
│   ├── base.html            # 基础布局（强烈推荐）
│   ├── index.html           # 首页（必需）
│   ├── post.html            # 文章详情页（必需）
│   ├── archives.html        # 归档页
│   ├── tag.html             # 单个标签页
│   ├── tags.html            # 标签汇总页
│   ├── blog.html            # 博客列表页（分页）
│   ├── 404.html             # 错误页
│   └── partials/            # 局部模板
├── assets/                  # 静态资源
│   ├── styles/              # CSS / LESS
│   └── media/images/        # 图片
└── screenshot.png           # 主题预览图
```

最小可用主题只需三个文件：`config.json`、`templates/index.html`、`templates/post.html`。

## 引擎声明

在 `config.json` 中通过 `templateEngine` 字段声明引擎：

```json
{
  "name": "my-theme",
  "version": "1.0.0",
  "templateEngine": "jinja2",
  "customConfig": []
}
```

:::caution
如果未声明 `templateEngine`，默认使用 `"ejs"`（为旧版兼容）。新主题务必显式声明引擎类型。
:::

## 渲染生命周期

Gridea Pro 构建博客时按以下流程执行：

1. **加载配置** -- 读取 `config.json`，解析主题元信息和自定义配置
2. **准备数据** -- 组装模板变量（`config`、`theme_config`、`posts`、`tags` 等）
3. **初始化引擎** -- 根据 `templateEngine` 初始化对应模板引擎
4. **渲染页面** -- 依次渲染首页、文章页、归档页、标签页等
5. **复制资源** -- 将 `assets/` 内容复制到输出目录（去除 `assets/` 前缀）
6. **输出完成** -- 生成完整的静态站点

## 深入学习

选择你的引擎，阅读对应的详细指南：

- [Jinja2 (Pongo2) 指南](./jinja2/) -- 推荐首选
- [Go Templates 指南](./go-templates/) -- 适合 Go 开发者
- [EJS 指南](./ejs/) -- 旧版兼容

通用参考资料：

- [模板变量参考](./variables/) -- 所有可用变量一览
- [主题配置 Schema](./config-schema/) -- config.json 完整规范
