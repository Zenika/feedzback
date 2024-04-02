import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  default: [
    'audience',
    'technical-stack',
    'installation',
    {
      type: 'category',
      label: 'Business cases',
      items: [
        //'business-cases/introduction',
        'business-cases/request-feedback',
        'business-cases/reply-to-feedback-request',
        'business-cases/give-spontaneous-feedback',
        'business-cases/feedback-draft',
        'business-cases/shared-feedback',
        //'business-cases/archiving',
      ],
    },
    /*{
      type: 'category',
      label: 'Technical guides',
      items: ['technical-guides/introduction'],
    },*/
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
    'documentation',
    'ubiquitous-language',
  ],
};

export default sidebars;
