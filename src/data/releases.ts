/**
 * 版本数据：构建时从 GitHub Releases 读取，读取失败时回退到仓库内的快照，
 * 保证更新日志、下载页、结构化数据里的版本号与 GitHub 一致，不再手工维护。
 * 设置环境变量 GITHUB_TOKEN 可提高 API 限额（Vercel 构建时可选）。
 */
import snapshot from './snapshots/releases.json';

export interface Asset {
  name: string;
  size: number;
  browser_download_url: string;
}

export interface Release {
  tag_name: string;
  name: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  html_url: string;
  body: string;
  assets: Asset[];
}

const API = 'https://api.github.com/repos/Gridea-Pro/gridea-pro/releases?per_page=100';

async function load(): Promise<Release[]> {
  try {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(API, { headers, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = (await res.json()) as Release[];
    const list = data.filter((r) => !r.draft);
    if (list.length === 0) throw new Error('empty release list');
    return list;
  } catch (err) {
    console.warn(`[releases] 读取 GitHub Releases 失败，使用快照：${(err as Error).message}`);
    return snapshot as Release[];
  }
}

let cache: Promise<Release[]> | undefined;
export function getReleases(): Promise<Release[]> {
  cache ??= load();
  return cache;
}

/** 最新正式版（非预发布）。 */
export async function getLatestStable(): Promise<Release> {
  const list = await getReleases();
  return list.find((r) => !r.prerelease) ?? list[0];
}

/** 比最新正式版更新的预发布版（若有）。 */
export async function getLatestPrerelease(): Promise<Release | undefined> {
  const list = await getReleases();
  const first = list[0];
  return first && first.prerelease ? first : undefined;
}

export function version(r: Release): string {
  return r.tag_name.replace(/^v/, '');
}

/** 以北京时间输出 YYYY-MM-DD。 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
}

export function formatSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export interface DownloadItem {
  key: string;
  os: 'macos' | 'windows' | 'linux';
  label: string;
  note: string;
  asset?: Asset;
}

/** 按文件名规则把发布资产归到各平台，命名规则见 Release 资产：Gridea.Pro_v<版本>_<平台>_<架构>[_<类型>].<扩展名> */
export function downloadItems(r: Release): DownloadItem[] {
  const find = (re: RegExp) => r.assets.find((a) => re.test(a.name));
  return [
    { key: 'mac-arm64', os: 'macos', label: 'Apple 芯片', note: '.dmg', asset: find(/_macos_arm64\.dmg$/) },
    { key: 'mac-amd64', os: 'macos', label: 'Intel 芯片', note: '.dmg', asset: find(/_macos_amd64\.dmg$/) },
    { key: 'win-x64-setup', os: 'windows', label: 'x64 安装版', note: '.exe', asset: find(/_windows_amd64_setup\.exe$/) },
    { key: 'win-x64-portable', os: 'windows', label: 'x64 便携版', note: '.exe', asset: find(/_windows_amd64_portable\.exe$/) },
    { key: 'win-arm64-setup', os: 'windows', label: 'ARM64 安装版', note: '.exe', asset: find(/_windows_arm64_setup\.exe$/) },
    { key: 'win-arm64-portable', os: 'windows', label: 'ARM64 便携版', note: '.exe', asset: find(/_windows_arm64_portable\.exe$/) },
    { key: 'linux-deb', os: 'linux', label: 'Debian / Ubuntu', note: '.deb', asset: find(/_linux_amd64\.deb$/) },
    { key: 'linux-rpm', os: 'linux', label: 'Fedora / RHEL', note: '.rpm', asset: find(/_linux_amd64\.rpm$/) },
    { key: 'linux-appimage', os: 'linux', label: '通用', note: '.AppImage', asset: find(/_linux_amd64\.AppImage$/) },
  ];
}
