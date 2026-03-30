---
title: GitHub Pages 部署
description: 将 Gridea Pro 博客部署到 GitHub Pages 的完整步骤，包括仓库创建、Token 配置和自定义域名。
---

GitHub Pages 是最常用的免费静态站点托管服务，与 Gridea Pro 的 Git 部署模式完美契合。

## 前置条件

- 一个 GitHub 账号
- Git 基本知识（Gridea Pro 会自动处理 Git 操作，但了解基础概念有助于排错）

## 第一步：创建 GitHub 仓库

1. 登录 GitHub，点击 **New repository**
2. 仓库名称填写 `<你的用户名>.github.io`（例如 `zhangsan.github.io`）
3. 设置为 **Public**（GitHub Pages 免费版要求公开仓库）
4. 不要勾选 "Initialize this repository"

:::tip
如果你不想使用 `<用户名>.github.io` 格式，也可以创建任意名称的仓库，然后使用 `gh-pages` 分支部署。最终地址为 `https://<用户名>.github.io/<仓库名>/`。
:::

## 第二步：生成 Personal Access Token

1. 进入 GitHub **Settings > Developer settings > Personal access tokens > Tokens (classic)**
2. 点击 **Generate new token (classic)**
3. 勾选 `repo` 权限（完整的仓库读写权限）
4. 设置合适的过期时间，点击 Generate
5. 复制生成的 Token

:::danger
Token 只在生成时显示一次。务必立即复制并保存到安全的位置。如果丢失，需要重新生成。
:::

## 第三步：配置 Gridea Pro

在 Gridea Pro 的 **设置 > 远程** 中填写：

| 配置项 | 值 |
|--------|-----|
| 平台 | GitHub |
| 仓库地址 | `https://github.com/<用户名>/<用户名>.github.io` |
| 分支 | `main` |
| Token | 上一步生成的 Token |
| 域名 | `https://<用户名>.github.io` |

## 第四步：同步部署

点击 Gridea Pro 的 **同步** 按钮，等待推送完成。首次同步后，访问 `https://<用户名>.github.io` 即可看到你的博客。

:::note
GitHub Pages 首次部署可能需要几分钟才能生效。如果访问返回 404，请等待 2-5 分钟后重试。你也可以在仓库的 **Settings > Pages** 中查看部署状态。
:::

## 自定义域名

1. 在域名 DNS 中添加 CNAME 记录：`blog.example.com` -> `<用户名>.github.io`
2. 在 GitHub 仓库 **Settings > Pages > Custom domain** 中填写 `blog.example.com`
3. 勾选 **Enforce HTTPS**
4. 在 Gridea Pro 中将站点域名改为 `https://blog.example.com`

## 常见问题

| 问题 | 解决方案 |
|------|----------|
| 同步失败提示 401 | Token 过期或权限不足，重新生成 |
| 页面显示 README 而非博客 | 确认 GitHub Pages 的 Source 设置为正确的分支 |
| CSS 样式丢失 | 检查站点域名配置是否包含仓库名路径 |

更多部署问题请查阅[常见问题](/faq/)。
