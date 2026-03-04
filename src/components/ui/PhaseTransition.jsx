'use client';

import { useEffect, useState } from 'react';
import styles from './PhaseTransition.module.css';

const PHASE_INFO = {
    1: {
        icon: 'recycling',
        label: 'Fase 1',
        title: 'Reciclagem Inteligente',
        description: 'Separe os materiais na lixeira correta antes do tempo acabar!',
    },
    2: {
        icon: 'bolt',
        label: 'Fase 2',
        title: 'Labirinto de Energia',
        description: 'Navegue pelos labirintos para desligar os aparelhos da tomada!',
    },
    3: {
        icon: 'quiz',
        label: 'Fase 3',
        title: 'Desafio Sustentável',
        description: 'Teste seus conhecimentos sobre sustentabilidade!',
    },
    start: {
        icon: 'eco',
        label: 'Preparando',
        title: 'EcoPlay',
        description: 'Carregando o jogo...',
    },
};

export default function PhaseTransition({ phase, onFinish }) {
    const [visible, setVisible] = useState(true);
    const info = PHASE_INFO[phase] || PHASE_INFO.start;

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onFinish) onFinish();
        }, 2000);

        return () => clearTimeout(timer);
    }, [phase, onFinish]);

    if (!visible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.content}>
                <div className={styles.iconRing}>
                    <span className="material-symbols-outlined">{info.icon}</span>
                </div>
                <p className={styles.phaseLabel}>{info.label}</p>
                <h2 className={styles.phaseTitle}>{info.title}</h2>
                <p className={styles.phaseDescription}>{info.description}</p>
                <div className={styles.dots}>
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                </div>
            </div>
        </div>
    );
}
