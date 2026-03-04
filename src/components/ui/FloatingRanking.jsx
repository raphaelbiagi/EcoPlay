'use client';

import { useState } from 'react';
import styles from './FloatingRanking.module.css';

export default function FloatingRanking({ ranking, currentPlayerName }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`${styles.floating} ${collapsed ? styles.collapsed : ''}`}>
            <button className={styles.toggle} onClick={() => setCollapsed(!collapsed)}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', color: 'var(--primary)' }}>
                    leaderboard
                </span>
                <span className={styles.toggleLabel}>
                    Ranking
                    {ranking.length > 0 && (
                        <span className={styles.count}>{ranking.length}</span>
                    )}
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--slate-400)', transition: 'transform 0.2s', transform: collapsed ? 'rotate(180deg)' : 'none' }}>
                    expand_more
                </span>
            </button>

            {!collapsed && (
                <div className={styles.body}>
                    {ranking.length === 0 ? (
                        <p className={styles.empty}>Nenhum jogador</p>
                    ) : (
                        <ul className={styles.list}>
                            {ranking.slice(0, 5).map((player) => {
                                const isMe = player.name === currentPlayerName;
                                return (
                                    <li
                                        key={player.id}
                                        className={`${styles.row} ${isMe ? styles.isMe : ''}`}
                                    >
                                        <span className={styles.pos}>
                                            {player.position <= 3 ? ['🥇', '🥈', '🥉'][player.position - 1] : `${player.position}º`}
                                        </span>
                                        <span className={styles.name}>
                                            {player.name}{isMe ? ' ★' : ''}
                                        </span>
                                        <span className={styles.score}>{player.score}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
