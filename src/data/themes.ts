/**
 * 主题数据：构建时读取官方主题仓库 README 中 GALLERY 区块的表格，失败时回退到仓库内的快照。
 * 主题仓库新增主题后，官网下次构建即自动同步，不在官网另维护一份列表。
 */
import snapshot from './snapshots/themes.json';
import { THEMES_REPO_URL } from './site';

export interface Theme {
  dir: string;
  name: string;
  engine: string;
  description: string;
  preview?: string;
  url: string;
  builtIn: boolean;
}

const README_URL = 'https://raw.githubusercontent.com/Gridea-Pro/gridea-pro-themes/main/README.md';
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/Gridea-Pro/gridea-pro-themes@main/';
/** 随客户端安装包内置的主题目录名（见客户端 frontend/public/default-files/themes）。 */
const BUILT_IN = new Set(['flavor-theme', 'amore', 'amore-jinja2', 'fly', 'inotes', 'notes', 'simple']);

export function parseGallery(md: string): Theme[] {
  const block = md.split('<!-- GALLERY:BEGIN -->')[1]?.split('<!-- GALLERY:END -->')[0] ?? '';
  const themes: Theme[] = [];
  for (const line of block.split('\n')) {
    const m = line.match(/^\|\s*(.*?)\s*\|\s*\[\*\*(.+?)\*\*\]\(\.\/themes\/([^/)]+)\/?\)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*$/);
    if (!m) continue;
    const [, previewCell, name, dir, engine, description] = m;
    const img = previewCell.match(/<img src="\.\/([^"]+)"/);
    themes.push({
      dir,
      name,
      engine: engine.replace(/\s*\(Pongo2\)/, ''),
      description: description.replace(/`/g, ''),
      preview: img ? CDN_BASE + img[1] : undefined,
      url: `${THEMES_REPO_URL}/tree/main/themes/${dir}`,
      builtIn: BUILT_IN.has(dir),
    });
  }
  return themes;
}

async function load(): Promise<Theme[]> {
  try {
    const res = await fetch(README_URL, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list = parseGallery(await res.text());
    if (list.length === 0) throw new Error('gallery is empty');
    return list;
  } catch (err) {
    console.warn(`[themes] 读取主题仓库失败，使用快照：${(err as Error).message}`);
    return snapshot as Theme[];
  }
}

let cache: Promise<Theme[]> | undefined;
export function getThemes(): Promise<Theme[]> {
  cache ??= load();
  return cache;
}
