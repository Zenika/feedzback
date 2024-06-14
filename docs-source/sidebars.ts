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
        'business-cases/request-feedback',
        'business-cases/reply-to-feedback-request',
        'business-cases/give-spontaneous-feedback',
        'business-cases/feedback-draft',
        'business-cases/shared-feedback',
        //'business-cases/archiving',
      ],
    },
    'ubiquitous-language',
    {
      type: 'category',
      label: 'Technical guides',
      items: [
        'technical-guides/introduction',
        {
          type: 'category',
          label: 'Client',
          items: ['technical-guides/client/firebase-hosting'],
        },
      ],
    },
    {
      type: 'category',
      label: 'CI / CD',
      items: ['ci-cd/quick-start', 'ci-cd/circle-ci'],
    },
    'usage-analytics',
    {
      type: 'category',
      label: 'Update guide',
      items: ['update/client'],
    },
    'documentation',
  ],
};

export default sidebars;
