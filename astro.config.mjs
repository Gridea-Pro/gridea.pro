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
        src: './public/gridea-pro.png',
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
            { label: '从 Gridea 迁移', translations: { en: 'Migrating from Gridea' }, slug: 'docs/getting-started/migration' },
          ],
        },
        {
          label: '功能指南',
          translations: { en: 'Feature Guide' },
          items: [
            { label: '概述', translations: { en: 'Overview' }, slug: 'docs/features' },
            { label: '闪念笔记', translations: { en: 'Memos' }, slug: 'docs/features/memos' },
            { label: '标签与分类', translations: { en: 'Tags & Categories' }, slug: 'docs/features/tags-categories' },
            { label: '评论系统', translations: { en: 'Comments' }, slug: 'docs/features/comments' },
            { label: '友情链接', translations: { en: 'Friend Links' }, slug: 'docs/features/links' },
            { label: 'AI 助手', translations: { en: 'AI Assistant' }, slug: 'docs/features/ai-assistant' },
            { label: 'SEO 设置', translations: { en: 'SEO Settings' }, slug: 'docs/features/seo' },
            { label: 'PWA 配置', translations: { en: 'PWA' }, slug: 'docs/features/pwa' },
            { label: 'CDN 与图片管理', translations: { en: 'CDN & Media' }, slug: 'docs/features/cdn-media' },
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
            { label: 'OAuth 授权总览', translations: { en: 'OAuth Overview' }, slug: 'docs/deployment/oauth' },
            { label: 'GitHub Pages', slug: 'docs/deployment/github-pages' },
            { label: 'Vercel', slug: 'docs/deployment/vercel' },
            { label: 'Netlify', slug: 'docs/deployment/netlify' },
            { label: 'Gitee Pages', slug: 'docs/deployment/gitee' },
            { label: 'Coding Pages', slug: 'docs/deployment/coding' },
            { label: 'SFTP / FTP', slug: 'docs/deployment/sftp' },
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
