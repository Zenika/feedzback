import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'FeedZback',
  tagline: 'Request and give feedback to your colleagues',
  favicon: 'img/favicon.svg',

  url: 'https://feedzback.znk.io',
  baseUrl: '/feedzback/',

  organizationName: 'Zenika',
  projectName: 'feedzback',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/Zenika/feedzback/tree/main/docusaurus/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/Zenika/feedzback/tree/main/docusaurus/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'FeedZback',
      logo: {
        alt: 'FeedZback Logo',
        src: 'img/logo.webp',
      },
      items: [
        {
          to: '/docs/installation',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        /*{
          to: '/blog',
          label: 'Blog',
          position: 'left'
        },*/
        {
          href: 'https://feedzback.znk.io',
          label: 'App',
          position: 'right',
        },
        {
          href: 'https://github.com/Zenika/feedzback',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    docs: {
      sidebar: {
        hideable: false,
        autoCollapseCategories: true,
      },
    },
    footer: {
      style: 'light',
      copyright: `Copyright © ${new Date().getFullYear()} FeedZback. Built with Docusaurus.`,
    },
    prism: {
      additionalLanguages: ['bash', 'json'],
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
