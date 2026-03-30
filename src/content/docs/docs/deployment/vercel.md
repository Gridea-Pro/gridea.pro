---
title: Vercel 部署
description: 将 Gridea Pro 博客部署到 Vercel，享受全球 CDN 加速和自动 HTTPS。
---

Vercel 提供全球边缘网络、自动 HTTPS 和极速部署，非常适合静态博客托管。

## 部署方式

有两种方式将 Gridea Pro 博客部署到 Vercel：

### 方式一：通过 GitHub 仓库（推荐）

这种方式利用 Vercel 与 GitHub 的集成，每次 Gridea Pro 同步推送后自动触发部署。

1. 先按照 [GitHub Pages 部署](./github-pages/)的步骤创建 GitHub 仓库并配置 Gridea Pro
2. 登录 [Vercel](https://vercel.com)，点击 **Import Project**
3. 选择你的博客仓库
4. Framework Preset 选择 **Other**
5. Build Command 留空（Gridea Pro 已经生成了静态文件）
6. Output Directory 设置为 `.`（根目录）
7. 点击 **Deploy**

:::tip
使用此方式后，每次在 Gridea Pro 中点击同步，Vercel 会自动检测到仓库变化并重新部署，通常在几秒内完成。
:::

### 方式二：Vercel CLI 手动部署

如果不想通过 GitHub，可以使用 Vercel CLI 直接上传：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 进入 Gridea Pro 的输出目录
cd ~/Documents/Gridea/output

# 部署
vercel --prod
```

## 自定义域名

1. 在 Vercel 项目的 **Settings > Domains** 中添加你的域名
2. 按照提示在 DNS 中添加对应记录（CNAME 或 A 记录）
3. Vercel 会自动签发 SSL 证书
4. 在 Gridea Pro 中更新站点域名

## 环境配置

Vercel 免费套餐包含：

| 特性 | 限制 |
|------|------|
| 带宽 | 100 GB / 月 |
| 构建次数 | 6000 次 / 月 |
| 自定义域名 | 50 个 |
| HTTPS | 自动、免费 |
| 全球 CDN | 包含 |

:::note
对于个人博客，Vercel 免费套餐的额度绑绑有余。即使日均数千访问量也不会超出限制。
:::

## 高级配置

可以在仓库根目录创建 `vercel.json` 自定义路由和头信息：

```json
{
  "headers": [
    {
      "source": "/styles/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/404.html" }
  ]
}
```

如遇问题，请查阅[常见问题](/faq/)或[部署概述](./index.md)中的通用排查步骤。
