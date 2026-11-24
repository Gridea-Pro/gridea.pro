/**
 * 站点实体信息的唯一来源。
 * 产品、作者、组织的名称与介绍文字须与 are-ink-seo 仓库 docs/entity-statement.md 保持逐字一致，
 * 页面元信息、结构化数据、关于页、llms.txt 都从这里取值，不要在页面里另写一份。
 */

export const SITE_URL = 'https://gridea.pro';
export const REPO_URL = 'https://github.com/Gridea-Pro/gridea-pro';
export const ORG_URL = 'https://github.com/Gridea-Pro';
export const THEMES_REPO_URL = 'https://github.com/Gridea-Pro/gridea-pro-themes';
export const AUTHOR_BLOG = 'https://are.ink/';
export const AUTHOR_ABOUT = 'https://are.ink/post/about/';
export const AUTHOR_GITHUB = 'https://github.com/Tespera';
export const CONTACT_EMAIL = 'hi@gridea.pro';
export const OG_IMAGE = `${SITE_URL}/appicon.png`;

export type Lang = 'zh-CN' | 'en';

export const STATEMENT = {
  'zh-CN': {
    oneLine: 'Gridea Pro 是一款开源的桌面端静态博客写作客户端，由 Eliauk 创建并维护，是 Gridea 的现代化重写版本。',
    standard:
      'Gridea Pro 是一款开源、免费、跨平台的桌面端静态博客写作客户端，支持 macOS、Windows 与 Linux。它由 Eliauk（GitHub：@Tespera）创建并主导维护，社区贡献者共同参与。Gridea Pro 基于 Go、Wails 与 Vue 3 从零重写了自 2022 年起停止维护的开源博客客户端 Gridea（原作者 EryouHao），兼容 Gridea 的站点数据与主题，以 GPL-3.0 协议开源。',
    author:
      'Gridea Pro 由 Eliauk 创建并主导维护。Eliauk 是一名软件产品经理，居住在深圳，也是原版 Gridea 的长期用户。Gridea 停止维护后，Eliauk 从零重写了这款客户端，并把产品思考、架构设计与技术取舍记录在个人博客「述尔」（are.ink）。',
    copyright: '© 2026 Eliauk 及 Gridea Pro 贡献者 · 基于 GPL-3.0 协议开源',
  },
  en: {
    oneLine: 'Gridea Pro is an open-source desktop client for writing static blogs, created and maintained by Eliauk as a modern rewrite of Gridea.',
    standard:
      'Gridea Pro is a free, open-source, cross-platform desktop client for writing and publishing static blogs on macOS, Windows and Linux. It is created and maintained by Eliauk (GitHub: @Tespera), with contributions from the community. Built from scratch with Go, Wails and Vue 3, Gridea Pro is a rewrite of Gridea, the open-source blog client by EryouHao that has been unmaintained since 2022. It is compatible with existing Gridea sites and themes, and is licensed under GPL-3.0.',
    author:
      "Gridea Pro is created and maintained by Eliauk, a software product manager based in Shenzhen and a long-time Gridea user. After Gridea stopped being maintained, Eliauk rewrote the client from scratch and documents the product thinking, architecture and technical trade-offs behind it on the blog Shu'er (are.ink).",
    copyright: '© 2026 Eliauk and Gridea Pro contributors · Licensed under GPL-3.0',
  },
} as const;

/** 结构化数据中的固定节点，用 @id 互相引用，保证各页面指向同一个实体。 */
export const PERSON_ID = 'https://are.ink/#author';
export const ORG_ID = `${SITE_URL}/#organization`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function personNode() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Eliauk',
    url: AUTHOR_ABOUT,
    sameAs: [AUTHOR_GITHUB, 'https://weibo.com/u/5364722640'],
  };
}

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Gridea Pro',
    url: SITE_URL + '/',
    logo: OG_IMAGE,
    email: CONTACT_EMAIL,
    founder: { '@id': PERSON_ID },
    sameAs: [ORG_URL],
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Gridea Pro',
    url: SITE_URL + '/',
    inLanguage: ['zh-CN', 'en'],
    publisher: { '@id': ORG_ID },
  };
}

export function softwareNode(lang: Lang, version?: string) {
  return {
    '@type': 'SoftwareApplication',
    '@id': SOFTWARE_ID,
    name: 'Gridea Pro',
    description: STATEMENT[lang].oneLine,
    url: SITE_URL + '/',
    image: OG_IMAGE,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Static blog client',
    operatingSystem: 'macOS, Windows, Linux',
    ...(version ? { softwareVersion: version } : {}),
    downloadUrl: `${SITE_URL}/download/`,
    releaseNotes: `${SITE_URL}/changelog/`,
    license: 'https://www.gnu.org/licenses/gpl-3.0.html',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@id': PERSON_ID },
    creator: { '@id': PERSON_ID },
    maintainer: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
    isBasedOn: {
      '@type': 'SoftwareApplication',
      name: 'Gridea',
      url: 'https://github.com/getgridea/gridea',
      author: { '@type': 'Person', name: 'EryouHao', url: 'https://github.com/EryouHao' },
    },
    sameAs: [REPO_URL],
  };
}

/** 所有页面共享的基础图：作者、组织、网站。页面再追加自己的节点。 */
export function baseGraph() {
  return [personNode(), organizationNode(), websiteNode()];
}
