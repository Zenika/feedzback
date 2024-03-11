import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={ clsx('hero', styles.heroBanner) }>
      <div className={ clsx('container', styles.container) }>
        <img src="./img/logo-feedzback.svg" width={212} height={112} alt="" />

        <Heading as="h1" className="hero__title">Documentation</Heading>

        <p className="hero__subtitle">{ siteConfig.tagline }</p>

        <div className={ styles.buttons }>
          <Link className="button button--secondary button--lg" to="/docs/installation">Get started</Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout title={ 'Documentation' }>
      <HomepageHeader />
    </Layout>
  );
}
