import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <meta name="apple-itunes-app" content="app-id=6468910867" />
      <div className={clsx('container', styles.heroInner)}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden />
          iOS 17+&nbsp;&nbsp;·&nbsp;&nbsp;灵动岛 &amp; 桌面小组件
        </span>
        <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
          {siteConfig.title}
        </Heading>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons}>
          <Link
            className={clsx('button button--lg', styles.btnPrimary)}
            to="https://apps.apple.com/app/id6468910867">
            立即下载
          </Link>
          <Link
            className={clsx('button button--lg', styles.btnOutline)}
            to="/docs/intro">
            查看文档
          </Link>
        </div>
        <p className={styles.heroMeta}>
          iOS · App Store 已上架&nbsp;&nbsp;·&nbsp;&nbsp;适用于 iPhone / iPad
        </p>
      </div>
    </header>
  );
}

function AppleMark() {
  return (
    <svg
      className={styles.appleMark}
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="currentColor"
      aria-hidden>
      <path d="M12.2 9.5c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.3-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.9-.7-1.5 0-2.9.9-3.6 2.2-1.6 2.7-.4 6.6 1.1 8.7.7 1 1.6 2.2 2.8 2.2 1.1 0 1.6-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2 0 2-1.1 2.7-2.1.9-1.2 1.2-2.4 1.3-2.4-.1 0-2.6-1-2.6-3.7zM10.1 3c.6-.7 1-1.7.9-2.7-.8.1-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6.9.1 1.9-.4 2.5-1.2z" />
    </svg>
  );
}

function DownloadCTA() {
  return (
    <section className={styles.cta}>
      <div className={clsx('container', styles.ctaInner)}>
        <div className={styles.ctaText}>
          <Heading as="h2" className={styles.ctaTitle}>
            让你的小组件、灵动岛长得不一样。
          </Heading>
          <p className={styles.ctaSub}>
            iPhone / iPad · App Store 一键下载
          </p>
        </div>
        <div className={styles.ctaActions}>
          <Link
            className={styles.ctaDownload}
            to="https://apps.apple.com/app/id6468910867">
            <AppleMark />
            App Store 下载
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="DIY 小组件和灵动岛 · iOS 16+ · 所见即所得编辑、JavaScript 运行时、桌面交互">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <DownloadCTA />
      </main>
    </Layout>
  );
}
