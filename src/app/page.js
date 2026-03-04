'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import FeatureCard from '@/components/ui/FeatureCard';
import PlayerNameModal from '@/components/ui/PlayerNameModal';
import PhaseTransition from '@/components/ui/PhaseTransition';
import { features } from '@/lib/gameData';
import styles from './page.module.css';

export default function HomePage() {
    const [showModal, setShowModal] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const router = useRouter();

    const handleStartClick = () => {
        setShowModal(true);
    };

    const handleConfirmName = (name) => {
        setShowModal(false);
        setPlayerName(name);
        setShowLoading(true);
    };

    const handleLoadingFinish = () => {
        router.push(`/game?name=${encodeURIComponent(playerName)}`);
    };

    return (
        <>
            {showModal && (
                <PlayerNameModal
                    onConfirm={handleConfirmName}
                    onClose={() => setShowModal(false)}
                />
            )}

            {showLoading && (
                <PhaseTransition phase="start" onFinish={handleLoadingFinish} />
            )}

            {/* Background Decorations */}
            <div className={styles.bgDecorations}>
                <div className={styles.bgIcon}>
                    <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>park</span>
                </div>
                <div className={styles.bgIcon}>
                    <span className="material-symbols-outlined" style={{ fontSize: '150px' }}>solar_power</span>
                </div>
                <div className={styles.bgIcon}>
                    <span className="material-symbols-outlined" style={{ fontSize: '80px' }}>wind_power</span>
                </div>
                <div className={styles.bgIcon}>
                    <span className="material-symbols-outlined" style={{ fontSize: '100px' }}>recycling</span>
                </div>
            </div>

            <Header variant="home" />

            <main className={`${styles.main} hero-pattern`}>
                <div className={styles.badge}>
                    <span className="material-symbols-outlined icon" style={{ color: 'var(--primary)', fontSize: '1.125rem' }}>verified</span>
                    <span className={styles.badgeText}>Aprendizado Gamificado</span>
                </div>

                <div className={styles.heroContent}>
                    <h2 className={styles.heroTitle}>
                        O Futuro é Verde. <br />
                        <span className={styles.heroHighlight}>Jogue para Mudar.</span>
                    </h2>
                    <p className={styles.heroDescription}>
                        Transformando o futuro através do aprendizado sustentável. A sustentabilidade não é apenas um
                        conceito, é um estilo de vida. O EcoPlay torna o aprendizado desses hábitos divertido, prático e
                        interativo.
                    </p>
                </div>

                <div className={styles.buttons}>
                    <button className={styles.startButton} onClick={handleStartClick}>
                        <span>INICIAR JOGO</span>
                        <span className="material-symbols-outlined">play_circle</span>
                    </button>
                    <button className={styles.tutorialButton}>
                        Ver Tutorial
                    </button>
                </div>

                <div className={styles.featuresGrid}>
                    {features.map((feature, i) => (
                        <FeatureCard key={i} {...feature} />
                    ))}
                </div>
            </main>
        </>
    );
}
