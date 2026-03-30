import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gridea.pro',
  output: 'static',
  adapter: vercel(),

  integrations: [
    starlight({
      title: 'Gridea Pro',
      favicon: '/favicon.ico',
      logo: {
        src: './public/appicon.png',
        replacesTitle: false,
      },
      components: {
        Header: './src/components/DocsHeader.astro',
        Head: './src/components/DocsHead.astro',
        ThemeProvider: './src/components/DocsThemeProvider.astro',
        ThemeSelect: './src/components/DocsThemeProvider.astro',
      },
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap' } },
      ],
      defaultLocale: 'root',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        en: {
          label: 'English',
          lang: 'en',
        },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/Gridea-Pro/gridea-pro' },
      ],
      customCss: [
        './src/assets/styles/starlight-overrides.css',
      ],
      sidebar: [
        {
          label: '快速开始',
          translations: { en: 'Getting Started' },
          items: [
            { label: '安装', translations: { en: 'Installation' }, slug: 'docs/getting-started/installation' },
            { label: '配置', translations: { en: 'Configuration' }, slug: 'docs/getting-started/configuration' },
            { label: '第一篇文章', translations: { en: 'First Post' }, slug: 'docs/getting-started/first-post' },
            { label: '发布部署', translations: { en: 'Publishing' }, slug: 'docs/getting-started/deployment' },
          ],
        },
        {
          label: '主题开发',
          translations: { en: 'Theme Development' },
          items: [
            { label: '概述', translations: { en: 'Overview' }, slug: 'docs/themes' },
            { label: 'Jinja2 (Pongo2)', slug: 'docs/themes/jinja2' },
            { label: 'Go Templates', slug: 'docs/themes/go-templates' },
            { label: 'EJS', slug: 'docs/themes/ejs' },
            { label: '模板变量', translations: { en: 'Template Variables' }, slug: 'docs/themes/variables' },
            { label: '配置 Schema', translations: { en: 'Config Schema' }, slug: 'docs/themes/config-schema' },
          ],
        },
        {
          label: '部署',
          translations: { en: 'Deployment' },
          items: [
            { label: 'GitHub Pages', slug: 'docs/deployment/github-pages' },
            { label: 'Vercel', slug: 'docs/deployment/vercel' },
            { label: 'Netlify', slug: 'docs/deployment/netlify' },
            { label: '自定义服务器', translations: { en: 'Custom Server' }, slug: 'docs/deployment/custom-server' },
          ],
        },
        {
          label: 'API 参考',
          translations: { en: 'API Reference' },
          items: [
            { label: '模板变量', translations: { en: 'Template Variables' }, slug: 'docs/reference/template-variables' },
            { label: '自定义函数', translations: { en: 'Custom Functions' }, slug: 'docs/reference/custom-functions' },
            { label: 'CLI', slug: 'docs/reference/cli' },
          ],
        },
        {
          label: '常见问题',
          translations: { en: 'FAQ' },
          slug: 'docs/faq',
        },
      ],
    }),
    sitemap(),
  ],
});
