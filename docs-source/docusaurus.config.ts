import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkDefList from 'remark-deflist';

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
          editUrl: 'https://github.com/Zenika/feedzback/tree/main/docs-source/',
          remarkPlugins: [remarkDefList],
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/Zenika/feedzback/tree/main/docs-source/',
          remarkPlugins: [remarkDefList],
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
          to: '/docs/audience',
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
      copyright: `Copyright © ${new Date().getFullYear()} FeedZback.`,
    },
    prism: {
      additionalLanguages: ['bash', 'json', 'scss'],
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
