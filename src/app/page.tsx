import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={135}
          height={29}
          priority
        />
      </header>
    </div>
  );
}
