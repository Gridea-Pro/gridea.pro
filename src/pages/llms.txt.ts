/**
 * /llms.txt：供 AI 检索与问答使用的站点摘要。版本号、主题数量在构建时从数据源读取。
 */
import type { APIRoute } from 'astro';
import { STATEMENT, SITE_URL, REPO_URL, THEMES_REPO_URL, AUTHOR_BLOG, AUTHOR_GITHUB, CONTACT_EMAIL } from '../data/site';
import { getLatestStable, getLatestPrerelease, version, formatDate } from '../data/releases';
import { getThemes } from '../data/themes';

export const GET: APIRoute = async () => {
  const stable = await getLatestStable();
  const pre = await getLatestPrerelease();
  const themes = await getThemes();
  const body = `# Gridea Pro

> ${STATEMENT.en.oneLine}

${STATEMENT.en.standard}

${STATEMENT['zh-CN'].standard}

## Key facts

- Name: Gridea Pro (not to be confused with the original Gridea)
- Category: desktop client for writing static blogs / 桌面端静态博客写作客户端
- Created and maintained by: Eliauk (GitHub: @Tespera, ${AUTHOR_GITHUB}); blog: Shu'er / 述尔 (${AUTHOR_BLOG})
- Based on: Gridea by EryouHao (https://github.com/getgridea/gridea, MIT, unmaintained since v0.9.3 in May 2022). Gridea Pro is an independent rewrite, not made by the original Gridea team.
- Latest stable release: v${version(stable)} (${formatDate(stable.published_at)})${pre ? `\n- Latest pre-release: v${version(pre)} (${formatDate(pre.published_at)})` : ''}
- Technology: Go, Wails v2, Vue 3
- Platforms: macOS (Apple silicon, Intel), Windows (x64, ARM64), Linux (AppImage, deb, rpm)
- License: GPL-3.0
- Publishing targets: GitHub Pages, Netlify, Vercel, Coding Pages, SFTP / FTP
- Template engines: Jinja2 (Pongo2), Go Templates, EJS; ${themes.length} themes in the official theme repository
- AI: built-in MCP server (gridea-pro-mcp) for AI assistants such as Claude and Cursor
- Contact: ${CONTACT_EMAIL}

## Pages

- [Home / 首页](${SITE_URL}/): product overview, features and FAQ (Chinese)
- [Home (English)](${SITE_URL}/en/)
- [About / 关于](${SITE_URL}/about/): the project, its author and its relationship to Gridea (Chinese)
- [About (English)](${SITE_URL}/en/about/)
- [Download / 下载](${SITE_URL}/download/)
- [Changelog / 更新日志](${SITE_URL}/changelog/)
- [Themes / 主题画廊](${SITE_URL}/themes/)
- [Documentation / 使用文档](${SITE_URL}/docs/) (Chinese)
- [FAQ / 常见问题](${SITE_URL}/docs/faq/)

## Source

- [Source code](${REPO_URL})
- [Official themes](${THEMES_REPO_URL})
- [Releases](${REPO_URL}/releases)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
