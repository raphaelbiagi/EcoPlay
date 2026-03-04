import styles from './FeatureCard.module.css';

export default function FeatureCard({ icon, title, description }) {
    return (
        <div className={styles.card}>
            <div className={styles.iconWrapper}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
        </div>
    );
}
