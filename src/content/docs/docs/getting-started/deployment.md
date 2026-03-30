---
title: 发布部署
description: 将 Gridea Pro 生成的静态博客一键部署到 GitHub Pages、Vercel、Netlify 或自定义服务器。
---

写好文章后，只需一键即可将博客部署到线上。Gridea Pro 支持多种部署方式。

## 一键部署流程

1. 确保已在[基础配置](./configuration/)中设置好远程仓库信息
2. 点击左侧边栏底部的 **同步** 按钮
3. Gridea Pro 会自动执行以下步骤：
   - 渲染所有文章和页面为静态 HTML
   - 复制主题的静态资源文件
   - 通过 Git 将生成的文件推送到远程仓库

:::tip
首次同步可能需要几秒到几十秒，取决于文章数量和网络状况。后续同步为增量更新，速度会更快。
:::

## 支持的部署平台

| 平台 | 特点 | 详细指南 |
|------|------|----------|
| GitHub Pages | 免费、稳定、与 GitHub 深度集成 | [GitHub Pages 部署](/deployment/github-pages/) |
| Vercel | 全球 CDN、自动 HTTPS、极速构建 | [Vercel 部署](/deployment/vercel/) |
| Netlify | 持续部署、表单处理、函数支持 | [Netlify 部署](/deployment/netlify/) |
| 自定义服务器 | 完全掌控、灵活配置 | [自定义服务器部署](/deployment/custom-server/) |

## 部署前检查

在点击同步之前，建议确认以下事项：

- 远程仓库 Token 是否有效（GitHub Token 有过期时间）
- 站点域名是否正确设置（影响生成的绝对链接）
- 主题是否正常工作（先使用预览功能确认）

:::caution
如果仓库 Token 过期或权限不足，同步会失败并提示认证错误。前往对应平台重新生成 Token，然后在 Gridea Pro 设置中更新。
:::

## 自定义域名

如果你有自己的域名，可以将其绑定到博客：

1. 在域名服务商处添加 CNAME 记录指向部署平台
2. 在 Gridea Pro 的站点域名配置中填写自定义域名
3. 在部署平台上配置自定义域名和 HTTPS

## 部署输出结构

Gridea Pro 生成的静态站点目录结构如下：

```
output/
├── index.html              # 首页
├── page/2/index.html       # 分页
├── post/<slug>/index.html  # 文章详情页
├── archives/index.html     # 归档页
├── tags/index.html         # 标签汇总页
├── tag/<name>/index.html   # 单个标签页
├── about/index.html        # 关于页
├── styles/                 # CSS 文件
├── media/                  # 图片等媒体文件
└── 404.html                # 错误页面
```

:::note
静态资源路径中不包含 `assets/` 前缀。主题目录中的 `assets/styles/main.css` 在输出中变为 `/styles/main.css`。详见[主题架构文档](/themes/)。
:::

更多部署细节请查阅[部署方式概述](/deployment/)。
