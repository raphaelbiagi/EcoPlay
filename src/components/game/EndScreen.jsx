import styles from './EndScreen.module.css';

export default function EndScreen({ score, onRestart }) {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <span className="material-symbols-outlined">social_leaderboard</span>
                </div>
                <h2 className={styles.title}>Missão Cumprida!</h2>
                <div className={styles.scoreSection}>
                    Sua pontuação final de impacto foi
                    <span className={styles.scoreValue}>{score}</span>
                    <span className={styles.scoreLabel}>Pontos EcoPlay</span>
                </div>
                <p className={styles.ecoMessage}>
                    Cada atitude conta para garantir um futuro mais verde! Use o conhecimento que você acabou de
                    praticar aqui no seu dia a dia.
                </p>
                <button className={styles.restartButton} onClick={onRestart}>
                    <span>Jogar Novamente</span>
                    <span className="material-symbols-outlined">refresh</span>
                </button>
            </div>
        </div>
    );
}
