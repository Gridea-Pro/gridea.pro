---
title: 安装指南
description: 在 macOS、Windows 和 Linux 上安装 Gridea Pro 的详细步骤，包含系统依赖和常见问题处理。
---

Gridea Pro 支持 macOS、Windows 和 Linux 三大平台。请根据你的操作系统选择对应的安装方式。

## macOS

### 通过 DMG 安装

1. 从 [Gridea Pro 官网](https://gridea.pro) 下载最新的 `.dmg` 安装包
2. 双击打开 DMG 文件，将 Gridea Pro 拖入 Applications 文件夹
3. 首次打开时，如果遇到"无法验证开发者"提示，前往 **系统设置 > 隐私与安全性**，点击"仍要打开"

:::tip
Gridea Pro 同时提供 Intel (x86_64) 和 Apple Silicon (arm64) 版本。下载时请选择与你 Mac 芯片匹配的版本以获得最佳性能。
:::

### 通过 Homebrew 安装

```bash
brew install --cask gridea-pro
```

## Windows

### 通过安装程序

1. 从官网下载 `.exe` 安装程序
2. 运行安装程序，按提示完成安装
3. 安装完成后，从开始菜单或桌面快捷方式启动

:::note
Windows 安装包已内置所有运行时依赖，无需额外安装。如遇到 SmartScreen 警告，点击"更多信息"然后选择"仍要运行"。
:::

### 便携版

如果你不希望安装到系统中，可以下载便携版 `.zip`，解压后直接运行 `GrideaPro.exe`。

## Linux

Linux 安装需要额外关注系统依赖，特别是 WebKit2GTK 库。

### Ubuntu / Debian

**Ubuntu 24.04 及以上：**

```bash
# 安装 WebKit2GTK 依赖（必需）
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-0t64

# 下载并安装 Gridea Pro
wget https://gridea.pro/download/gridea-pro-latest-amd64.deb
sudo dpkg -i gridea-pro-latest-amd64.deb
sudo apt install -f  # 修复可能的依赖问题
```

:::danger
Ubuntu 24.04 中 WebKit2GTK 包名发生了变化，必须安装 `libwebkit2gtk-4.1-0t64` 而非旧版的 `libwebkit2gtk-4.0-37`。安装错误的包名会导致依赖解析失败，应用无法启动。
:::

**Ubuntu 22.04：**

```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.0-37
wget https://gridea.pro/download/gridea-pro-latest-amd64.deb
sudo dpkg -i gridea-pro-latest-amd64.deb
```

### Fedora / RHEL

```bash
sudo dnf install webkit2gtk4.1
sudo rpm -i gridea-pro-latest-x86_64.rpm
```

### Arch Linux

```bash
sudo pacman -S webkit2gtk-4.1
# 通过 AUR 安装
yay -S gridea-pro-bin
```

## 验证安装

安装完成后，启动 Gridea Pro，你应该能看到欢迎界面。如果一切正常，接下来前往[基础配置](./configuration/)设置你的博客信息。

## 常见安装问题

| 问题 | 解决方案 |
|------|----------|
| macOS 提示"已损坏，无法打开" | 终端执行 `xattr -cr /Applications/Gridea\ Pro.app` |
| Linux 启动白屏 | 确认已安装正确版本的 WebKit2GTK |
| Windows 安装后无法启动 | 尝试以管理员权限运行 |

如仍有问题，请查阅[常见问题](/faq/)页面。
