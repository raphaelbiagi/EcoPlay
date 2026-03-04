import styles from './RankingPanel.module.css';

export default function RankingPanel({ ranking, currentPlayerName }) {
    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <span className="material-symbols-outlined">leaderboard</span>
                    Ranking ao Vivo
                </div>
                <div className={styles.liveIndicator}>
                    <span className={styles.liveDot} />
                    {ranking.length} online
                </div>
            </div>

            {ranking.length === 0 ? (
                <div className={styles.emptyState}>
                    <span className="material-symbols-outlined">group</span>
                    Aguardando jogadores...
                </div>
            ) : (
                <ul className={styles.list}>
                    {ranking.map((player) => {
                        const isMe = player.name === currentPlayerName;
                        let posClass = styles.position;
                        if (player.position === 1) posClass += ` ${styles.first}`;
                        else if (player.position === 2) posClass += ` ${styles.second}`;
                        else if (player.position === 3) posClass += ` ${styles.third}`;

                        return (
                            <li
                                key={player.id}
                                className={`${styles.playerRow} ${isMe ? styles.isMe : ''}`}
                            >
                                <div className={posClass}>{player.position}</div>
                                <div className={styles.playerInfo}>
                                    <p className={styles.playerName}>
                                        {player.name} {isMe ? '(você)' : ''}
                                    </p>
                                    <p className={`${styles.playerStatus} ${player.status === 'finished' ? styles.finished : ''}`}>
                                        {player.status === 'finished' ? '✓ Finalizado' : '● Jogando...'}
                                    </p>
                                </div>
                                <div className={styles.playerScore}>{player.score} pts</div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
