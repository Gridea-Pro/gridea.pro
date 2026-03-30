---
title: 快速上手
description: 从零开始使用 Gridea Pro 搭建你的静态博客，5 分钟完成安装、配置和第一篇文章的发布。
---

Gridea Pro 是一款跨平台桌面静态博客客户端，基于 **Go + Wails v2** 构建，前端使用 Vue 3。它提供内置 Markdown 编辑器、多引擎主题系统和一键部署能力，让你专注于写作本身。

## 核心特性

- **跨平台支持** -- macOS、Windows、Linux 全平台可用
- **内置编辑器** -- 所见即所得的 Markdown 编辑体验
- **三引擎主题系统** -- 支持 Jinja2 (Pongo2)、Go Templates、EJS 三种模板引擎
- **一键部署** -- 支持 GitHub Pages、Vercel、Netlify 等主流平台
- **本地优先** -- 所有数据存储在本地，无需依赖云服务

## 快速开始路径

按照以下顺序阅读文档，你将在最短时间内搭建好自己的博客：

1. [安装 Gridea Pro](./installation/) -- 下载并安装到你的操作系统
2. [基础配置](./configuration/) -- 设置站点名称、描述、头像等基本信息
3. [写第一篇文章](./first-post/) -- 使用内置编辑器创建并预览文章
4. [发布部署](./deployment/) -- 将博客部署到线上

:::tip
如果你是主题开发者，完成基础上手后可以直接前往[主题开发文档](/themes/)深入了解三引擎架构。
:::

## 系统要求

| 操作系统 | 最低版本 | 备注 |
|----------|----------|------|
| macOS | 10.15 (Catalina) | 支持 Intel 和 Apple Silicon |
| Windows | Windows 10 | 64 位 |
| Linux | Ubuntu 22.04+ | 需安装 WebKit2GTK 依赖 |

:::caution
Linux 用户请务必阅读[安装指南](./installation/)中的依赖安装部分，缺少 WebKit2GTK 库将导致应用无法启动。
:::

## 技术架构

Gridea Pro 采用 Go 后端 + Vue 3 前端的混合架构，通过 Wails v2 框架实现桌面端原生体验：

- **后端 (Go)** -- 文章管理、模板渲染、静态站点生成、Git 部署
- **前端 (Vue 3)** -- 编辑器界面、设置面板、主题预览
- **渲染引擎** -- Pongo2 (Jinja2)、Go 标准库 text/template、EJS

构建时，Gridea Pro 读取 Markdown 文章和主题模板，渲染为纯静态 HTML 文件，可以部署到任意静态托管服务。
