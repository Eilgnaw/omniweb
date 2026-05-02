import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '入门',
      collapsed: false,
      link: {type: 'generated-index', slug: '/category/getting-started'},
      items: [
        'getting-started/concepts',
        'getting-started/first-widget',
        'getting-started/placeholder',
      ],
    },
    {
      type: 'category',
      label: '组件',
      collapsed: false,
      link: {type: 'generated-index', slug: '/category/components'},
      items: [
        'components/text',
        'components/image',
        'components/icon',
        'components/shape',
        'components/button',
        'components/date',
        'components/gauge',
        'components/spacer',
        'components/stack',
        'components/grid',
        'components/loop',
      ],
    },
    {
      type: 'category',
      label: '接口文档',
      collapsed: false,
      link: {type: 'generated-index', slug: '/category/api'},
      items: [
        'api/network',
        'api/config',
        'api/control',
        'api/widget',
        'api/device',
        'api/location',
        'api/weather',
        'api/health',
        'api/calendar',
        'api/date',
        'api/fileManager',
        'api/html',
        'api/console',
      ],
    },
    'changelog',
  ],
};

export default sidebars;
