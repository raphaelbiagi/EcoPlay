'use client';

import Header from '@/components/ui/Header';
import RankingPanel from '@/components/ui/RankingPanel';
import { useSocket } from '@/hooks/useSocket';
import styles from './page.module.css';

export default function RankingPage() {
    const { ranking } = useSocket();

    return (
        <div className={styles.container}>
            <Header variant="home" />
            <main className={styles.main}>
                <h1 className={styles.title}>
                    <span className="material-symbols-outlined">leaderboard</span>
                    Ranking ao Vivo
                </h1>
                <p className={styles.subtitle}>
                    Acompanhe a pontuação de todos os jogadores em tempo real.
                </p>
                <div className={styles.rankingWrapper}>
                    <RankingPanel ranking={ranking} currentPlayerName="" />
                </div>
            </main>
        </div>
    );
}
