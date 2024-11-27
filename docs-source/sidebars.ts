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
        'business-cases/archiving',
      ],
    },
    'ubiquitous-language',
    {
      type: 'category',
      label: 'Technical guides',
      items: [
        {
          type: 'category',
          label: 'Environments',
          items: ['technical-guides/environments/overview', 'technical-guides/environments/local-dev'],
        },
        {
          type: 'category',
          label: 'Client',
          items: [
            'technical-guides/client/firebase-hosting',
            'technical-guides/client/styles',
            'technical-guides/client/icons',
            'technical-guides/client/demo',
            'technical-guides/client/cookies',
            'technical-guides/client/i18n',
          ],
        },
        {
          type: 'category',
          label: 'Server',
          items: ['technical-guides/server/swagger'],
        },
        'technical-guides/e2e-testing',
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
