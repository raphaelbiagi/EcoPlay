'use client';

import { useState } from 'react';
import styles from './PlayerNameModal.module.css';

export default function PlayerNameModal({ onConfirm, onClose }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed) {
            onConfirm(trimmed);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.iconWrapper}>
                    <span className="material-symbols-outlined">person_add</span>
                </div>
                <h2 className={styles.title}>Qual é o seu nome?</h2>
                <p className={styles.subtitle}>
                    Informe seu nome para entrar no ranking e competir com outros jogadores em tempo real!
                </p>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Digite seu nome..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                            maxLength={20}
                        />
                        <span className={`material-symbols-outlined ${styles.inputIcon}`}>badge</span>
                    </div>
                    <button
                        className={styles.playButton}
                        type="submit"
                        disabled={!name.trim()}
                    >
                        <span>JOGAR AGORA</span>
                        <span className="material-symbols-outlined">play_circle</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
