import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  tag: string;
  title: string;
  description: ReactNode;
  href: string;
  Icon: () => ReactNode;
};

function IconEditor() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconScript() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="8 6 2 12 8 18" />
      <polyline points="16 6 22 12 16 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  );
}

function IconTouch() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 11V6a2 2 0 1 1 4 0v5" />
      <path d="M13 11V4.5a2 2 0 1 1 4 0V13" />
      <path d="M17 13V7.5a2 2 0 1 1 4 0V16a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-1l-3-5a2 2 0 0 1 3.46-2L9 12" />
    </svg>
  );
}

const FeatureList: FeatureItem[] = [
  {
    tag: 'WYSIWYG',
    title: '界面编辑',
    description:
      '所见即所得,轻松编辑小组件和灵动岛。从灵动岛展开态到锁屏上的小组件,统一在一个画布里搞定。',
    href: '/docs/intro',
    Icon: IconEditor,
  },
  {
    tag: 'JS RUNTIME',
    title: '动态数据',
    description:
      '内置 JavaScript 运行时,接入网络、日历、健康等系统 API,让小组件真正「会动」。',
    href: '/docs/api/network',
    Icon: IconScript,
  },
  {
    tag: 'iOS 17+',
    title: '用户交互',
    description: '为 iOS 17 以上系统提供的桌面交互能力,小组件可以响应点击、滑动、长按。',
    href: '/docs/components/text',
    Icon: IconTouch,
  },
];

function Feature({tag, title, description, href, Icon}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.cardCol)}>
      <a href={href} className={styles.card}>
        <div className={styles.iconWrap}>
          <Icon />
        </div>
        <span className={styles.cardTag}>{tag}</span>
        <Heading as="h3" className={styles.cardTitle}>
          {title}
        </Heading>
        <p className={styles.cardDesc}>{description}</p>
        <span className={styles.cardLink}>查看文档 →</span>
      </a>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <header className={styles.head}>
          <span className={styles.headEyebrow}>FEATURES</span>
          <Heading as="h2" className={styles.headTitle}>
            为创作者打造的桌面小工具
          </Heading>
          <p className={styles.headDesc}>
            所见即所得的编辑、可编程数据、原生交互 —— 三块拼合起一个真正属于你的桌面。
          </p>
        </header>
        <div className={clsx('row', styles.cardRow)}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
