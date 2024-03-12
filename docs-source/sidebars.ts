import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  default: [
    'installation',
    {
      type: 'category',
      label: 'Guide',
      items: ['guide/introduction'],
    },
    {
      type: 'category',
      label: 'CI / CD',
      items: ['ci-cd/quick-start', 'ci-cd/circle-ci'],
    },
  ],
};

export default sidebars;
