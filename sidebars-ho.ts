import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  hoSidebar: [
    'intro',
    {
      type: 'category',
      label: '入门',
      collapsed: false,
      items: [
        'getting-started/concepts',
        'getting-started/first-widget',
        'getting-started/placeholder',
        'getting-started/quickstart',
      ],
    },
    {
      type: 'category',
      label: '组件',
      collapsed: false,
      items: [
        'components/text',
        'components/text-clock',
        'components/text-timer',
        'components/image',
        'components/icon',
        'components/stack',
        'components/button',
        'components/grid',
        'components/blank',
      ],
    },
    {
      type: 'category',
      label: '接口文档',
      collapsed: false,
      items: [
        'api/config',
        'api/network',
        'api/console',
        'api/fileManager',
        'api/device',
        'api/control',
      ],
    },
  ],
};

export default sidebars;
