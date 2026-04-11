---
title: Coding Pages 部署
description: 将 Gridea Pro 博客部署到 Coding Pages 静态网站托管。
---

Coding（现为腾讯云旗下 CODING DevOps）提供静态网站托管服务，适合国内用户。

## 前提条件

- 注册 [Coding](https://coding.net) 账号
- 创建一个项目和代码仓库

## 配置步骤

### 1. 创建 Coding 项目和仓库

1. 登录 Coding，创建新项目
2. 在项目中创建代码仓库
3. 仓库将用于存放博客静态文件

### 2. 生成访问令牌

1. 进入 **个人设置** > **访问令牌**
2. 创建新的个人访问令牌
3. 勾选代码仓库相关权限
4. 保存生成的令牌

### 3. 在 Gridea Pro 中配置

1. 打开 Gridea Pro，进入 **设置**
2. 部署平台选择 **Coding Pages**
3. 填写配置信息：
   - **仓库地址** — Coding 仓库地址（格式如 `https://e.coding.net/team/project/repo.git`）
   - **分支** — 部署分支
   - **用户名** — Coding 用户名
   - **邮箱** — 注册邮箱
   - **Token** — 个人访问令牌

4. 保存设置

### 4. 部署

1. 点击 Gridea Pro 顶部的 **部署** 按钮
2. 等待渲染和推送完成

### 5. 开启静态网站

1. 在 Coding 项目中进入 **持续部署** > **静态网站**
2. 关联代码仓库和分支
3. 配置构建设置（静态文件直接部署，无需构建命令）
4. 启动部署

## 自定义域名

1. 在 Coding 静态网站设置中添加自定义域名
2. 在 DNS 服务商处添加 CNAME 记录
3. Coding 支持自动 HTTPS 证书

## 注意事项

- Coding 的仓库地址格式为 `e.coding.net`，注意区分
- 静态网站托管功能可能需要在项目中单独开启
- 具体操作界面可能随 Coding 平台更新而变化，请以 Coding 官方文档为准
