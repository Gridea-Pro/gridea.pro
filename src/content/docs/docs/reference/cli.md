---
title: CLI 命令参考
description: Gridea Pro 命令行工具的完整用法，支持无界面构建和部署，适用于 CI/CD 集成。
---

Gridea Pro 除了图形界面外，还提供命令行工具，支持在无 GUI 环境下执行构建和部署操作，适合集成到 CI/CD 流水线中。

## 安装

CLI 工具随 Gridea Pro 主程序一起安装。你也可以单独安装 CLI：

```bash
# macOS / Linux
curl -fsSL https://gridea.pro/install-cli.sh | bash

# 或通过 Go 安装
go install github.com/getgridea/gridea-pro/cmd/gridea@latest
```

## 基础命令

### gridea build

构建静态站点：

```bash
# 在 Gridea 数据目录下执行
gridea build

# 指定源目录和输出目录
gridea build --source ~/Documents/Gridea --output ./dist
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--source`, `-s` | Gridea 数据目录 | 当前目录 |
| `--output`, `-o` | 输出目录 | `./output` |
| `--theme`, `-t` | 指定主题名称 | 使用配置中的主题 |
| `--draft` | 包含草稿文章 | `false` |

:::tip
在 CI/CD 环境中，使用 `--source` 和 `--output` 参数明确指定路径，避免依赖工作目录。
:::

### gridea serve

启动本地预览服务器：

```bash
gridea serve

# 指定端口
gridea serve --port 8080
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--port`, `-p` | 服务器端口 | `4000` |
| `--source`, `-s` | Gridea 数据目录 | 当前目录 |
| `--open` | 自动打开浏览器 | `false` |

启动后会监听文件变化并自动重新构建，适合主题开发时实时预览。

### gridea deploy

执行部署（推送到远程仓库）：

```bash
gridea deploy

# 构建并部署
gridea build && gridea deploy
```

:::caution
`deploy` 命令需要在 Gridea 数据目录中已配置好远程仓库信息。首次使用前请先在 GUI 中完成[远程仓库配置](/getting-started/configuration/)。
:::

### gridea new

创建新文章：

```bash
# 创建文章
gridea new "我的新文章"

# 指定日期和标签
gridea new "技术分享" --date 2026-03-30 --tags "Go,博客"
```

## 主题开发命令

### gridea theme init

初始化新主题脚手架：

```bash
gridea theme init my-theme --engine jinja2
```

| 参数 | 说明 |
|------|------|
| `--engine` | 模板引擎：`jinja2`（默认）、`go`、`ejs` |

生成的目录结构包含 `config.json`、必需模板文件和示例样式。

### gridea theme validate

验证主题语法和结构：

```bash
gridea theme validate ./themes/my-theme
```

检查内容包括：
- config.json 格式是否正确
- 必需模板文件是否存在
- 模板标签是否配对
- 变量名拼写是否正确

### gridea theme test

使用 mock 数据渲染主题进行测试：

```bash
gridea theme test ./themes/my-theme --output ./test-output
```

:::note
`theme test` 使用内置的 mock 数据渲染所有页面，无需真实文章数据。适合在主题开发初期快速验证模板渲染。
:::

## CI/CD 集成示例

### GitHub Actions

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Gridea CLI
        run: curl -fsSL https://gridea.pro/install-cli.sh | bash
      - name: Build
        run: gridea build --source ./blog-data --output ./dist
      - name: Deploy to Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 退出码

| 退出码 | 含义 |
|--------|------|
| `0` | 成功 |
| `1` | 一般错误 |
| `2` | 配置错误 |
| `3` | 模板渲染错误 |
| `4` | 部署错误 |
