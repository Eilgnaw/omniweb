import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './download.module.css';

const appStoreUrl = 'https://apps.apple.com/app/id6468910867';
const pluginVsixUrl = '/img/omni-widgets-0.1.1.vsix';
const harmonyAppUrl = '<HARMONYOS_APP_DOWNLOAD_URL>';

type Copy = {
  title: string;
  description: string;
  appLabel: string;
  appTitle: string;
  appDescription: string;
  appButton: string;
  appMeta: string;
  harmonyLabel: string;
  harmonyTitle: string;
  harmonyDescription: string;
  harmonyButton: string;
  harmonyMeta: string;
  pluginLabel: string;
  pluginTitle: string;
  pluginDescription: string;
  pluginButton: string;
  pluginMeta: string;
  docsButton: string;
  requirementsTitle: string;
  requirements: string[];
};

const copy: Record<string, Copy> = {
  'zh-Hans': {
    title: '下载 Omni Widgets',
    description: '在 iPhone 和 iPad 上创建、编辑和运行你的桌面小组件、锁屏小组件和灵动岛内容。',
    appLabel: 'iOS / iPadOS',
    appTitle: 'Omni Widgets App',
    appDescription: '从 App Store 安装正式版，适用于 iPhone 和 iPad。',
    appButton: 'App Store 下载',
    appMeta: 'iOS 17+ · iPhone / iPad',
    harmonyLabel: 'HarmonyOS',
    harmonyTitle: 'Omni Widgets HarmonyOS',
    harmonyDescription: '安装 HarmonyOS 版本,使用桌面卡片、锁屏卡片和外部调用 AppLink。',
    harmonyButton: 'HarmonyOS 下载',
    harmonyMeta: 'HarmonyOS 6+ · 手机',
    pluginLabel: '桌面端',
    pluginTitle: 'VS Code 插件',
    pluginDescription: '连接 App 中已打开的代码编辑器，在电脑上编写小组件 JavaScript 并同步回手机。',
    pluginButton: '下载 VSIX',
    pluginMeta: 'VS Code 1.90+ · v0.1.1',
    docsButton: '查看使用文档',
    requirementsTitle: '使用前确认',
    requirements: [
      '手机和电脑连接到同一个 Wi-Fi。',
      '使用 VS Code 插件时，保持 Omni Widgets 的代码编辑器打开。',
      '下载 VSIX 后，在 VS Code 扩展面板中选择从 VSIX 安装。',
    ],
  },
  en: {
    title: 'Download Omni Widgets',
    description: 'Create, edit, and run Home Screen widgets, Lock Screen widgets, and Live Activities on iPhone and iPad.',
    appLabel: 'iOS / iPadOS',
    appTitle: 'Omni Widgets App',
    appDescription: 'Install the production build from the App Store for iPhone and iPad.',
    appButton: 'Download on the App Store',
    appMeta: 'iOS 17+ · iPhone / iPad',
    harmonyLabel: 'HarmonyOS',
    harmonyTitle: 'Omni Widgets for HarmonyOS',
    harmonyDescription: 'Install the HarmonyOS build to use widgets, Lock Screen cards, and AppLink actions.',
    harmonyButton: 'HarmonyOS download',
    harmonyMeta: 'HarmonyOS 6+ · Phone',
    pluginLabel: 'Desktop',
    pluginTitle: 'VS Code Extension',
    pluginDescription: 'Connect to the code editor opened in the app, edit widget JavaScript on your desktop, and sync it back to your phone.',
    pluginButton: 'Download VSIX',
    pluginMeta: 'VS Code 1.90+ · v0.1.1',
    docsButton: 'View Documentation',
    requirementsTitle: 'Before You Start',
    requirements: [
      'Keep your phone and computer on the same Wi-Fi network.',
      'When using the VS Code extension, keep the Omni Widgets code editor open.',
      'After downloading the VSIX, install it from the VS Code Extensions view.',
    ],
  },
};

function AppleMark() {
  return (
    <svg className={styles.buttonIcon} width="16" height="18" viewBox="0 0 16 18" fill="currentColor" aria-hidden>
      <path d="M12.2 9.5c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.3-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.9-.7-1.5 0-2.9.9-3.6 2.2-1.6 2.7-.4 6.6 1.1 8.7.7 1 1.6 2.2 2.8 2.2 1.1 0 1.6-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2 0 2-1.1 2.7-2.1.9-1.2 1.2-2.4 1.3-2.4-.1 0-2.6-1-2.6-3.7zM10.1 3c.6-.7 1-1.7.9-2.7-.8.1-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6.9.1 1.9-.4 2.5-1.2z" />
    </svg>
  );
}

function DesktopMark() {
  return (
    <svg className={styles.panelIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 5.75A2.75 2.75 0 0 1 6.75 3h10.5A2.75 2.75 0 0 1 20 5.75v7.5A2.75 2.75 0 0 1 17.25 16H6.75A2.75 2.75 0 0 1 4 13.25v-7.5Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 20h6M12 16v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function AppIcon() {
  return (
    <div className={styles.appIcon} aria-hidden>
      <img src="/img/logo.svg" alt="" />
    </div>
  );
}

export default function Download(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const locale = i18n.currentLocale === 'en' ? 'en' : 'zh-Hans';
  const text = copy[locale];

  return (
    <Layout title={text.title} description={text.description}>
      <meta name="apple-itunes-app" content="app-id=6468910867" />
      <main className={styles.page}>
        <section className={clsx('container', styles.header)}>
          <AppIcon />
          <div className={styles.headerText}>
            <Heading as="h1" className={styles.title}>
              {text.title}
            </Heading>
            <p className={styles.description}>{text.description}</p>
          </div>
        </section>

        <section className={clsx('container', styles.downloadGrid)} aria-label={text.title}>
          <article className={clsx(styles.downloadPanel, styles.primaryPanel)}>
            <div className={styles.panelTop}>
              <span className={styles.label}>{text.appLabel}</span>
              <AppIcon />
            </div>
            <Heading as="h2" className={styles.panelTitle}>
              {text.appTitle}
            </Heading>
            <p className={styles.panelText}>{text.appDescription}</p>
            <Link className={styles.storeButton} to={appStoreUrl}>
              <AppleMark />
              {text.appButton}
            </Link>
            <p className={styles.meta}>{text.appMeta}</p>
          </article>

          <article className={styles.downloadPanel}>
            <div className={styles.panelTop}>
              <span className={styles.label}>{text.harmonyLabel}</span>
              <AppIcon />
            </div>
            <Heading as="h2" className={styles.panelTitle}>
              {text.harmonyTitle}
            </Heading>
            <p className={styles.panelText}>{text.harmonyDescription}</p>
            {harmonyAppUrl.startsWith('http') ? (
              <a className={styles.downloadButton} href={harmonyAppUrl}>
                {text.harmonyButton}
              </a>
            ) : (
              <span className={styles.statusPill}>{harmonyAppUrl}</span>
            )}
            <p className={styles.meta}>{text.harmonyMeta}</p>
          </article>

          <article className={styles.downloadPanel}>
            <div className={styles.panelTop}>
              <span className={styles.label}>{text.pluginLabel}</span>
              <DesktopMark />
            </div>
            <Heading as="h2" className={styles.panelTitle}>
              {text.pluginTitle}
            </Heading>
            <p className={styles.panelText}>{text.pluginDescription}</p>
            <div className={styles.actionRow}>
              <a className={styles.downloadButton} href={pluginVsixUrl} download>
                {text.pluginButton}
              </a>
              <Link className={styles.docsButton} to="/docs/intro">
                {text.docsButton}
              </Link>
            </div>
            <p className={styles.meta}>{text.pluginMeta}</p>
          </article>
        </section>

        <section className={clsx('container', styles.requirements)}>
          <Heading as="h2" className={styles.requirementsTitle}>
            {text.requirementsTitle}
          </Heading>
          <ul className={styles.requirementsList}>
            {text.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}
