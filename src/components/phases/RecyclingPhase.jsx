'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { recyclingItems, binData } from '@/lib/gameData';
import { POINTS, RECYCLING_TIMER_SECONDS } from '@/lib/constants';
import styles from './RecyclingPhase.module.css';

export default function RecyclingPhase({ onScore, onFeedback, onComplete, onUpdateExtra }) {
    const [pool] = useState(() =>
        [...recyclingItems].sort(() => Math.random() - 0.5)
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const [dragOverBin, setDragOverBin] = useState(null);
    const [timeLeft, setTimeLeft] = useState(RECYCLING_TIMER_SECONDS);
    const [recycledCount, setRecycledCount] = useState(0);
    const timerRef = useRef(null);
    const completedRef = useRef(false);

    const currentItem = pool[currentIndex] || null;

    // Update the extra card display with time
    useEffect(() => {
        if (onUpdateExtra) {
            onUpdateExtra(timeLeft + 's');
        }
    }, [timeLeft, onUpdateExtra]);

    // Timer
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    if (!completedRef.current) {
                        completedRef.current = true;
                        setTimeout(() => {
                            onFeedback(`Tempo esgotado! Você reciclou ${recycledCount} itens.`, 'success');
                            onComplete();
                        }, 0);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [onFeedback, onComplete, recycledCount]);

    const handleDrop = useCallback((itemId, binType) => {
        if (completedRef.current || !currentItem) return;
        if (currentItem.id !== itemId) return;

        if (currentItem.type === binType) {
            onScore(POINTS.RECYCLING_CORRECT);
            onFeedback('Correto! +10 pontos', 'success');
            const newCount = recycledCount + 1;
            setRecycledCount(newCount);
            setSelectedId(null);

            const nextIdx = currentIndex + 1;
            if (nextIdx >= pool.length) {
                // All items recycled!
                completedRef.current = true;
                clearInterval(timerRef.current);
                onFeedback('Todos os itens reciclados! Fase Concluída!', 'success');
                setTimeout(() => onComplete(), 500);
            } else {
                setCurrentIndex(nextIdx);
            }
        } else {
            onFeedback('Lixeira incorreta. Tente novamente.', 'error');
            setSelectedId(null);
        }
    }, [currentItem, currentIndex, pool, recycledCount, onScore, onFeedback, onComplete]);

    const handleDragStart = (e, itemId) => {
        e.dataTransfer.setData('text/plain', itemId);
    };

    const handleBinDragOver = (e) => {
        e.preventDefault();
    };

    const handleBinDrop = (e, binType) => {
        e.preventDefault();
        setDragOverBin(null);
        const draggedId = e.dataTransfer.getData('text/plain');
        handleDrop(draggedId, binType);
    };

    const handleItemClick = (itemId) => {
        setSelectedId(selectedId === itemId ? null : itemId);
    };

    const handleBinClick = (binType) => {
        if (selectedId && currentItem) {
            handleDrop(currentItem.id, binType);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.arena}>
                {/* Timer Bar */}
                <div className={styles.timerBar}>
                    <div className={styles.timerInfo}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>timer</span>
                        <span className={styles.timerText}>{timeLeft}s</span>
                    </div>
                    <div className={styles.timerTrack}>
                        <div
                            className={styles.timerFill}
                            style={{ width: `${(timeLeft / RECYCLING_TIMER_SECONDS) * 100}%` }}
                        />
                    </div>
                    <span className={styles.itemCount}>
                        {recycledCount}/{pool.length} reciclados
                    </span>
                </div>

                {/* Single Draggable Item */}
                <div className={styles.itemsZone}>
                    {currentItem && (
                        <div
                            key={currentItem.id}
                            className={`${styles.draggableItem} ${selectedId === currentItem.id ? styles.selected : ''}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, currentItem.id)}
                            onClick={() => handleItemClick(currentItem.id)}
                        >
                            <div className={styles.itemCard}>
                                <div className={styles.itemCardHoverOverlay} />
                                <span className={styles.itemEmoji}>{currentItem.icon}</span>
                            </div>
                            <div className={styles.itemLabel}>
                                <span className="material-symbols-outlined">touch_app</span>
                                {currentItem.name}
                            </div>
                        </div>
                    )}
                </div>

                {/* Recycling Bins */}
                <div className={styles.binsGrid}>
                    {binData.map((bin) => (
                        <div
                            key={bin.type}
                            className={styles.bin}
                            onClick={() => handleBinClick(bin.type)}
                            onDragOver={handleBinDragOver}
                            onDragEnter={() => setDragOverBin(bin.type)}
                            onDragLeave={() => setDragOverBin(null)}
                            onDrop={(e) => handleBinDrop(e, bin.type)}
                        >
                            <div
                                className={`${styles.binInner} ${dragOverBin === bin.type ? styles.dragOver : ''}`}
                                style={{ backgroundColor: bin.color }}
                            >
                                <span className={`material-symbols-outlined ${styles.binIcon}`}>{bin.icon}</span>
                                <div className={styles.binWatermark}>
                                    <span>{bin.type}</span>
                                </div>
                                <p className={styles.binLabel}>{bin.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
