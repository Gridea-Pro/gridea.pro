---
title: Gitee Pages 部署
description: 将 Gridea Pro 博客部署到 Gitee Pages，适合国内用户快速访问。
---

Gitee Pages 是国内 Git 平台 Gitee 提供的静态页面托管服务，国内访问速度快，无需备案。

## 前提条件

- 注册 [Gitee](https://gitee.com) 账号
- 创建一个用于存放博客的仓库

## 配置步骤

### 1. 创建 Gitee 仓库

1. 登录 Gitee，点击右上角 **+** > **新建仓库**
2. 仓库名称建议设为你的用户名（例如 `username`），这样博客地址为 `username.gitee.io`
3. 设置为 **公开** 仓库
4. 初始化仓库（勾选 README）

### 2. 生成私人令牌

1. 进入 Gitee **设置** > **私人令牌** > **生成新令牌**
2. 填写令牌描述，如 `gridea-pro`
3. 勾选 `projects` 权限
4. 点击 **提交**，复制生成的令牌

:::caution
令牌只显示一次，请妥善保存。如果丢失需要重新生成。
:::

### 3. 在 Gridea Pro 中配置

1. 打开 Gridea Pro，进入 **设置**
2. 部署平台选择 **Gitee Pages**
3. 填写以下信息：
   - **仓库地址** — 格式如 `https://gitee.com/username/repo`
   - **分支** — 通常为 `master`（Gitee 默认分支）
   - **用户名** — Gitee 用户名
   - **邮箱** — Gitee 注册邮箱
   - **Token** — 上一步生成的私人令牌

4. 保存设置

### 4. 部署

1. 点击 Gridea Pro 顶部的 **部署** 按钮
2. 等待渲染和推送完成

### 5. 开启 Gitee Pages 服务

:::caution
首次部署后，需要在 Gitee 仓库中手动开启 Pages 服务：
:::

1. 进入 Gitee 仓库页面
2. 点击 **服务** > **Gitee Pages**
3. 选择部署分支（与 Gridea Pro 中配置的一致）
4. 点击 **启动**
5. 后续更新部署后，需要点击 **更新** 按钮刷新页面

## 自定义域名

1. 在 Gitee Pages 设置页面中填写自定义域名
2. 在域名 DNS 服务商处添加 CNAME 记录，指向 `username.gitee.io`
3. 等待 DNS 生效

## 注意事项

- Gitee Pages 免费版需要手动点击「更新」才能刷新部署内容
- Gitee Pages Pro（付费版）支持自动部署和自定义域名 HTTPS
- Gitee 默认分支为 `master`，注意与 GitHub 的 `main` 区分
