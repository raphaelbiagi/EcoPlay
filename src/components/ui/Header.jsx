import styles from './Header.module.css';

export default function Header({ variant = 'home' }) {
    if (variant === 'game') {
        return (
            <header className={`${styles.header} ${styles.headerGame}`}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <span className="material-symbols-outlined">eco</span>
                    </div>
                    <h1 className={`${styles.logoText} ${styles.logoTextGame}`}>EcoPlay</h1>
                </div>
                <nav className={styles.nav}>
                    <a className={styles.navLink} href="#">Como Jogar</a>
                    <a className={styles.navLink} href="#">Ranking</a>
                    <a className={styles.navLink} href="#">Conquistas</a>
                </nav>
                <div className={styles.gameActions}>
                    <button className={styles.iconButton}>
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                    <div className={styles.avatar}>
                        <span className="material-symbols-outlined">person</span>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>
                    <span className="material-symbols-outlined">eco</span>
                </div>
                <h1 className={styles.logoText}>EcoPlay</h1>
            </div>
            <nav className={styles.nav}>
                <a className={styles.navLink} href="#">Sobre o Projeto</a>
                <a className={styles.navLink} href="#">Impacto</a>
            </nav>
            <button className={styles.menuButton}>
                <span className="material-symbols-outlined">menu</span>
            </button>
        </header>
    );
}
