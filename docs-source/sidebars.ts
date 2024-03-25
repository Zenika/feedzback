import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  default: [
    'audience',
    'technical-stack',
    'installation',
    {
      type: 'category',
      label: 'Technical guides',
      items: ['technical-guides/introduction'],
    },
    {
      type: 'category',
      label: 'CI / CD',
      items: ['ci-cd/quick-start', 'ci-cd/circle-ci', 'ci-cd/usage-analytics'],
    },
    {
      type: 'category',
      label: 'Update guide',
      items: ['update/client'],
    },
    {
      type: 'category',
      label: 'Business cases',
      items: ['business-cases/introduction'],
    },
  ],
};

export default sidebars;
