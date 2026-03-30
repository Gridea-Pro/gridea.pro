---
title: 自定义服务器部署
description: 将 Gridea Pro 博客部署到自己的服务器，使用 Nginx 或 Caddy 提供静态文件服务。
---

如果你拥有自己的 VPS 或云服务器，可以完全掌控博客的部署环境。本指南介绍使用 Nginx 和 Caddy 部署的方法。

## 方式一：Git + 自动拉取

最简单的方式是在服务器上设置一个定时任务从 Git 仓库拉取更新。

### 设置步骤

1. 在服务器上克隆 Gridea Pro 推送的仓库：

```bash
cd /var/www
git clone https://github.com/username/blog.git gridea-blog
```

2. 创建自动拉取脚本：

```bash
#!/bin/bash
cd /var/www/gridea-blog
git pull origin main
```

3. 添加到 crontab（每 5 分钟检查一次）：

```bash
*/5 * * * * /path/to/pull-blog.sh
```

:::tip
更优雅的方案是使用 GitHub Webhook。当 Gridea Pro 推送到仓库后，GitHub 会主动通知你的服务器拉取更新，实现秒级部署。
:::

## 方式二：手动上传

如果不使用 Git，可以直接将输出文件上传到服务器：

```bash
# 通过 rsync 上传
rsync -avz --delete ~/Documents/Gridea/output/ user@server:/var/www/gridea-blog/

# 或通过 scp
scp -r ~/Documents/Gridea/output/* user@server:/var/www/gridea-blog/
```

## Nginx 配置

```nginx
server {
    listen 80;
    server_name blog.example.com;
    root /var/www/gridea-blog;
    index index.html;

    # 处理 clean URL
    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }

    # 自定义 404 页面
    error_page 404 /404.html;

    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/html text/css application/javascript;
}
```

:::caution
确保 Nginx 用户对博客目录有读取权限。如果使用 `www-data` 用户，运行 `chown -R www-data:www-data /var/www/gridea-blog`。
:::

## Caddy 配置

Caddy 自动处理 HTTPS 证书，配置更加简洁：

```
blog.example.com {
    root * /var/www/gridea-blog
    file_server
    try_files {path} {path}/ {path}/index.html
    handle_errors {
        rewrite * /404.html
        file_server
    }
}
```

## HTTPS 配置

### 使用 Let's Encrypt（Nginx）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取并配置证书
sudo certbot --nginx -d blog.example.com
```

### 使用 Caddy

Caddy 默认自动从 Let's Encrypt 获取和续期 HTTPS 证书，无需额外配置。

## 性能优化建议

1. **启用 HTTP/2** -- Nginx 在 HTTPS 配置中添加 `http2`
2. **启用 Brotli 压缩** -- 比 gzip 更高效
3. **配置 CDN** -- 在服务器前面加一层 Cloudflare 等 CDN 加速全球访问
4. **合理的缓存策略** -- 静态资源长期缓存，HTML 文件短期缓存

:::note
Gridea Pro 生成的静态文件体积通常很小（纯 HTML + CSS），即使是低配 VPS 也能轻松应对大量并发访问。
:::
