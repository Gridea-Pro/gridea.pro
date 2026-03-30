---
title: Netlify 部署
description: 将 Gridea Pro 博客部署到 Netlify，利用持续部署和全球 CDN 托管博客。
---

Netlify 提供持续部署、全球 CDN、自动 HTTPS 等特性，是静态站点托管的热门选择。

## 通过 GitHub 仓库部署

1. 先将 Gridea Pro 配置为推送到 GitHub 仓库（参考 [GitHub Pages 部署](./github-pages/)）
2. 登录 [Netlify](https://netlify.com)，点击 **Add new site > Import an existing project**
3. 选择 GitHub，授权并选择博客仓库
4. 配置构建设置：

| 配置项 | 值 |
|--------|-----|
| Build command | 留空 |
| Publish directory | `.` |
| Branch | `main`（与 Gridea Pro 配置一致） |

5. 点击 **Deploy site**

:::tip
Netlify 会为你分配一个随机子域名（如 `random-name-123.netlify.app`），你可以在 **Site settings > Domain management** 中修改为更友好的名称。
:::

## 自定义域名

1. 进入 **Site settings > Domain management > Add custom domain**
2. 输入你的域名并验证
3. Netlify 会提示你添加 DNS 记录：
   - CNAME: `blog.example.com` -> `your-site.netlify.app`
   - 或将 Nameserver 迁移到 Netlify DNS
4. HTTPS 证书自动签发

## 404 页面配置

Gridea Pro 生成的 `404.html` 会被 Netlify 自动识别为自定义错误页面，无需额外配置。

:::note
Netlify 自动检测根目录下的 `404.html` 文件。如果你的主题包含 `templates/404.html` 模板，Gridea Pro 会自动生成对应的 `404.html` 输出文件。
:::

## 高级配置

在仓库根目录创建 `netlify.toml` 文件自定义行为：

```toml
[build]
  publish = "."

[[headers]]
  for = "/styles/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

## 表单和函数

Netlify 还提供表单处理和 Serverless Functions 等附加功能。虽然 Gridea Pro 生成的是纯静态站点，但你可以在主题模板中添加 Netlify Forms 来收集读者反馈：

```html
<form name="contact" method="POST" data-netlify="true">
  <input type="text" name="name" placeholder="你的名字" />
  <textarea name="message" placeholder="留言内容"></textarea>
  <button type="submit">发送</button>
</form>
```

## Netlify 免费套餐

| 特性 | 限制 |
|------|------|
| 带宽 | 100 GB / 月 |
| 构建时间 | 300 分钟 / 月 |
| 站点数 | 无限 |
| HTTPS | 自动、免费 |
| 表单提交 | 100 次 / 月 |

如遇问题，请查阅[常见问题](/faq/)。
