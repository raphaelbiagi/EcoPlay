import styles from './ScoreCard.module.css';

export default function ScoreCard({ label, value, feedback }) {
    return (
        <div className={styles.card}>
            <p className={styles.label}>{label}</p>
            <p className={styles.value}>{value}</p>
            {feedback !== undefined && (
                <span className={`${styles.feedback} ${feedback ? styles.feedbackVisible : ''}`}>
                    {feedback}
                </span>
            )}
        </div>
    );
}
