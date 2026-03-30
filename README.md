<p align="center">
  <img src="appicon.png" alt="Gridea Pro" width="128">
</p>

<h1 align="center">Gridea Pro</h1>

<p align="center">
  <strong>一个简洁的开源跨平台桌面端静态博客写作客户端</strong>
</p>

<p align="center">
  <a href="https://gridea.pro">官网</a> &nbsp;|&nbsp;
  <a href="https://gridea.pro/docs/">文档</a> &nbsp;|&nbsp;
  <a href="https://gridea.pro/download/">下载</a> &nbsp;|&nbsp;
  <a href="https://gridea.pro/themes/">主题</a> &nbsp;|&nbsp;
  <a href="https://gridea.pro/changelog/">更新日志</a>
</p>

---

此仓库是 **Gridea Pro** 官方网站的源代码。Gridea Pro 是 [Gridea](https://github.com/getgridea/gridea) 的下一代版本 —— 一个在 GitHub 上获得 10,000+ Stars 的桌面端静态博客写作客户端。

## 功能特性

- 内置 Markdown 编辑器，所见即所得
- 多主题支持，一键切换
- 一键部署到 GitHub Pages、Vercel、Netlify 等平台
- 文章、闪念、分类、标签、评论管理
- 支持 **macOS** · **Windows** · **Linux** 三大平台

## 项目结构

```
gridea.pro/
├── css/
│   ├── base.css              # 公共 CSS 变量与重置样式
│   ├── index.css              # 首页样式
│   ├── download.css           # 下载页样式
│   ├── themes.css             # 主题画廊样式
│   ├── changelog.css          # 更新日志样式
│   └── docs.css               # 文档页样式
├── js/
│   ├── reveal.js              # 滚动动画
│   ├── os-detect.js           # 下载页系统检测
│   ├── filter-tabs.js         # 主题筛选交互
│   ├── changelog.js           # 更新日志折叠与筛选
│   └── docs-nav.js            # 文档侧边栏与目录导航
├── index.html                 # 首页
├── download.html              # 下载
├── themes.html                # 主题画廊
├── changelog.html             # 更新日志
├── docs.html                  # 使用文档
└── appicon.png                # 应用图标
```

## 本地开发

纯静态网站，无需构建工具，克隆后直接在浏览器中打开即可：

```bash
git clone https://github.com/Gridea-Pro/gridea.pro.git
cd gridea.pro
open index.html
```

## 参与贡献

欢迎通过 [Issues](https://github.com/Gridea-Pro/gridea.pro/issues) 反馈问题或提交 Pull Request。

## 开源协议

本项目基于 [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html) 协议开源。

---

<p align="center">
  &copy; 2026 Gridea Pro Contributors
</p>
