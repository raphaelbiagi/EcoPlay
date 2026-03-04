import styles from './ProgressTracker.module.css';

export default function ProgressTracker({ phaseNumber, title, progress }) {
    return (
        <div className={styles.container}>
            <div className={styles.topRow}>
                <div>
                    <p className={styles.subtitle}>Nível {phaseNumber}</p>
                    <h2 className={styles.title}>{title}</h2>
                </div>
                <span className={styles.progressPercent}>{progress}%</span>
            </div>
            <div className={styles.barOuter}>
                <div className={styles.barInner} style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}
