---
title: 从 Gridea 迁移
description: 从 Gridea 迁移到 Gridea Pro 的完整指南，涵盖自动迁移机制、数据结构差异和常见问题。
---

如果你是 Gridea 的老用户，正在考虑是否要升级到 Gridea Pro，这篇指南是为你写的。

博客数据是多年心血的积累，迁移这件事如果出了差错，损失难以弥补。因此，在设计 Gridea Pro 时，**数据兼容与自动迁移**是优先级最高的功能之一。

**结论先说：你的数据是安全的。** Gridea Pro 内置了完整的自动迁移机制，无需手动转换任何文件，打开即用。

## 数据结构差异

在了解迁移机制之前，先说明两个版本之间的数据结构变化。

### 1. 实体 ID 规范化

旧版 Gridea 的分类、标签、菜单等数据，早期版本没有 ID 字段，或使用了 UUID 等较长的格式。Gridea Pro 统一采用 **6 位 NanoID**（如 `kGUBpB`），更简洁，读写性能更好。

### 2. 文章关联方式变更

这是最核心的变化。

旧版 Gridea 文章的 YAML frontmatter 里，标签和分类是直接存**名称**的：

```yaml
---
title: 我的第一篇文章
date: 2021-06-01 12:00:00
tags:
  - 技术
  - 生活
categories:
  - 随笔
---
```

Gridea Pro 改为存 **ID**：

```yaml
---
title: 我的第一篇文章
createdAt: 2021-06-01 12:00:00
updatedAt: 2021-06-01 12:00:00
tagIDs:
  - kGUBpB
  - abc123
categoryIDs:
  - jjTYMA
---
```

这样设计的好处是：重命名标签或分类时，不需要扫描修改所有文章文件，只改一处即可。

### 3. 时间字段重命名

旧版使用 `date` 字段，Gridea Pro 拆分为 `createdAt`（创建时间）和 `updatedAt`（更新时间），支持独立追踪文章的修改历史。

## 自动迁移机制

Gridea Pro **每次启动时**自动运行数据迁移，分为两个阶段。

### 第一阶段：基础数据 ID 补全

扫描以下数据，为没有 ID 或 ID 格式不符规范的条目自动生成新的 6 位 NanoID：

| 数据类型 | 文件位置 |
|---------|---------|
| 分类 | `config/categories.json` |
| 标签 | `config/tags.json` |
| 菜单 | `config/menus.json` |
| 友链 | `config/links.json` |
| 闪念 | `config/memos.json` |

**只有数据真正发生变化时才会写入文件**，没有冗余操作。

### 第二阶段：文章关联关系转换

这是迁移的核心步骤。程序会：

1. 扫描所有 `.md` 文章文件
2. 读取每篇文章 frontmatter 里的 `tags`（名称）和 `categories`（名称/Slug）
3. 通过第一阶段建立的映射表，找到对应的新 ID
4. 将 `tagIDs` 和 `categoryIDs` 写回 frontmatter
5. 同时保留旧的 `tags` 字段作为降级备份

整个过程完全自动，用户无感知。

## 迁移前准备

### 1. 备份数据目录

:::danger
**必须备份！** 迁移后无法退回旧版 Gridea，因为清洗后的数据结构不兼容旧版。
:::

你的 Gridea 数据默认存放在：

- **macOS**：`~/Documents/gridea/`
- **Windows**：`C:\Users\你的用户名\Documents\gridea\`

将整个文件夹复制一份到其他位置即可：

```bash
# macOS / Linux
cp -r ~/Documents/gridea ~/Documents/gridea-backup-$(date +%Y%m%d)
```

### 2. 确认数据目录结构

Gridea Pro 沿用了与 Gridea 完全相同的数据目录结构：

```
gridea/
├── config/
│   ├── categories.json   # 分类
│   ├── tags.json         # 标签
│   ├── menus.json        # 菜单
│   ├── links.json        # 友链
│   ├── setting.json      # 站点设置
│   └── themeConfig.json  # 主题配置
├── post/                 # 文章 Markdown 文件
└── post-images/          # 文章图片
```

只要目录结构一致，Gridea Pro 即可直接读取。

## 迁移步骤

### 第一步：备份源数据目录

将整个文件夹复制一份到其他位置。

### 第二步：下载并安装 Gridea Pro

前往 [下载页面](https://gridea.pro/download) 或 [GitHub Releases](https://github.com/Gridea-Pro/gridea-pro/releases) 下载对应平台的安装包。安装方法详见 [安装指南](/docs/getting-started/installation)。

### 第三步：首次打开，自动迁移

程序启动时会在后台自动执行迁移，通常在几秒内完成。完成后即可进入主界面。

如果你是开发者，可以在日志中看到类似输出：

```
[DataMigrator] --------- 开始全量检查与迁移历史基础关联数据 ID ---------
[DataMigrator] ✅ 检查完成，未发现需要修正的历史数据，所有数据均处于最新健康状态。
[DataMigrator] --------- 数据清洗迁移协程运行完毕 ---------
```

若有数据被迁移，日志会列出具体修改的条目和数量。

### 第四步：验证数据完整性

迁移完成后，建议做以下检查：

- **检查文章列表** — 打开「文章」页面，确认所有文章均正常显示，标题、时间、标签、分类无缺失
- **检查标签和分类** — 打开「标签」和「分类」管理页面，确认数量与迁移前一致
- **预览一篇文章** — 随机打开一篇文章进入编辑器，确认正文内容完整，标签和分类关联正确
- **本地预览站点** — 点击预览，确认站点整体渲染正常

## 需要重新配置的部分

迁移机制覆盖了绝大多数数据，但以下内容需要手动重新配置：

### 部署平台设置

Gridea Pro 重新设计了部署配置的存储方式，**不会自动读取旧版的平台配置**。你需要在「设置」中重新填写：

- 平台选择（GitHub / Gitee / Vercel / Netlify / SFTP 等）
- 仓库地址、Token、分支等信息

旧版的 `setting.json` 中相关字段不会被覆盖，可以参照它手动填写。

:::tip
部署平台的详细配置方法见 [发布部署](/docs/getting-started/deployment) 章节。
:::

### 评论系统

Gridea Pro 支持 7 种评论系统（Gitalk、Giscus、Disqus、Valine、Waline、Twikoo、Cusdis），配置入口在「评论」设置页。旧版 Gridea 的评论配置不会自动迁移。

详见 [评论系统](/docs/features/comments) 了解各平台的配置方法。

## 常见问题

### 迁移后能否退回 Gridea？

**不可以。** 数据结构不一致，经过 Gridea Pro 清洗后旧版 Gridea 无法打开新版数据。如果你备份了源数据文件夹，想要回退，可以在旧版 Gridea 中将站点目录指向备份的文件夹。

### 迁移会修改文章正文内容吗？

不会。迁移只修改 YAML frontmatter 部分（文章顶部两个 `---` 之间的元数据），正文内容完全不受影响。

### 有几百篇文章，迁移会很慢吗？

不会。迁移在本地运行，处理速度极快，几百篇文章通常在 1 秒内完成。

### 数据目录不在默认位置怎么办？

在 Gridea Pro 的系统设置中修改「站点源文件路径」，选择你原来的目录即可。建议直接选择备份目录，这样不影响旧版 Gridea 的正常运行。

### 迁移后标签或分类显示有问题？

可以在 Gridea Pro 的「分类」、「标签」页面手动修改。如果有其他问题，前往 [GitHub Issues](https://github.com/Gridea-Pro/gridea-pro/issues) 反馈。

## 迁移总结

| 事项 | 说明 |
|------|------|
| 迁移方式 | 全自动，启动时执行 |
| 需要用户操作 | 仅需备份数据目录 |
| 文章内容是否改变 | 不改变 |
| 能否退回旧版 | 不可以（需提前备份） |
| 需手动重配的内容 | 部署平台、评论系统 |

如果你在迁移过程中遇到任何问题，欢迎到 [GitHub](https://github.com/Gridea-Pro/gridea-pro/issues) 提交 Issue。
