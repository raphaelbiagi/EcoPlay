'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { quizQuestions } from '@/lib/gameData';
import { POINTS } from '@/lib/constants';
import styles from './QuizPhase.module.css';

const QUESTION_TIME = 15; // seconds per question

export default function QuizPhase({ onScore, onFeedback, onComplete, onUpdateExtra }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [result, setResult] = useState(null); // null | 'correct' | 'wrong'
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
    const timerRef = useRef(null);

    const currentQ = quizQuestions[currentIndex];

    // Update extra card
    useEffect(() => {
        if (onUpdateExtra) {
            onUpdateExtra(`${currentIndex + 1}/${quizQuestions.length}`);
        }
    }, [currentIndex, onUpdateExtra]);

    // Per-question timer
    useEffect(() => {
        if (answered) return;

        setTimeLeft(QUESTION_TIME);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    // Time ran out: auto-wrong
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [currentIndex, answered]);

    const handleTimeUp = useCallback(() => {
        if (answered) return;
        setAnswered(true);
        setSelectedIndex(null);
        setResult('wrong');
        onFeedback('Tempo esgotado!', 'error');
        goToNext();
    }, [answered, currentIndex]);

    const goToNext = useCallback(() => {
        setTimeout(() => {
            const nextIdx = currentIndex + 1;
            if (nextIdx >= quizQuestions.length) {
                onComplete();
            } else {
                // Reset state BEFORE changing index
                setResult(null);
                setSelectedIndex(null);
                setAnswered(false);
                setCurrentIndex(nextIdx);
            }
        }, 2500);
    }, [currentIndex, onComplete]);

    const handleAnswer = useCallback((index) => {
        if (answered) return;

        clearInterval(timerRef.current);
        setAnswered(true);
        setSelectedIndex(index);

        const correct = index === currentQ.correct;
        setResult(correct ? 'correct' : 'wrong');

        if (correct) {
            onScore(POINTS.QUIZ_CORRECT);
        }

        goToNext();
    }, [answered, currentQ, onScore, goToNext]);

    if (!currentQ) return null;

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* Top info */}
                <div className={styles.topInfo}>
                    <div>
                        <h1 className={styles.topInfoTitle}>Desafio Sustentável</h1>
                        <p className={styles.topInfoSubtitle}>Responda corretamente para ganhar pontos</p>
                    </div>
                    <div className={styles.topRight}>
                        <div className={`${styles.timerBadge} ${timeLeft <= 5 && !answered ? styles.danger : ''}`}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>timer</span>
                            {answered ? '—' : `${timeLeft}s`}
                        </div>
                        <div className={styles.questionCounter}>
                            Questão <span className={styles.questionNumber}>{currentIndex + 1}</span>{' '}
                            <span className={styles.questionTotal}>/ {quizQuestions.length}</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${((currentIndex) / quizQuestions.length) * 100}%` }}
                    />
                </div>

                {/* Quiz Card */}
                <div className={styles.quizCard} key={currentIndex}>
                    <div className={styles.questionBody}>
                        <div className={styles.questionBadge}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>help</span>
                            Pergunta {currentIndex + 1}
                        </div>
                        <h2 className={styles.questionText}>{currentQ.q}</h2>

                        {/* Timer bar under question */}
                        {!answered && (
                            <div className={styles.questionTimer}>
                                <div
                                    className={`${styles.questionTimerFill} ${timeLeft <= 5 ? styles.timerDanger : ''}`}
                                    style={{ width: `${(timeLeft / QUESTION_TIME) * 100}%` }}
                                />
                            </div>
                        )}

                        {/* Options */}
                        <div className={styles.optionsGrid}>
                            {currentQ.options.map((opt, index) => {
                                let cardClass = styles.optionCard;
                                let iconText = '';
                                let iconClass = styles.statusIcon;

                                if (answered && result !== null) {
                                    if (index === selectedIndex) {
                                        cardClass += result === 'correct' ? ` ${styles.correct}` : ` ${styles.wrong}`;
                                        iconText = result === 'correct' ? 'verified' : 'cancel';
                                        iconClass += ` ${styles.visible} ${result === 'correct' ? styles.correctIcon : styles.wrongIcon}`;
                                    } else if (index === currentQ.correct && result === 'wrong') {
                                        cardClass += ` ${styles.correct}`;
                                        iconText = 'verified';
                                        iconClass += ` ${styles.visible} ${styles.correctIcon}`;
                                    }
                                }

                                return (
                                    <label
                                        key={index}
                                        className={`${styles.optionLabel} ${answered ? styles.disabled : ''}`}
                                        onClick={() => handleAnswer(index)}
                                    >
                                        <div className={cardClass}>
                                            <div className={styles.optionLetter}>
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p className={styles.optionText}>{opt}</p>
                                            </div>
                                            <span className={`material-symbols-outlined ${iconClass}`}>{iconText}</span>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>

                        {/* Feedback Box — only render when answered with a result */}
                        {answered && result !== null && (
                            <div className={`${styles.feedbackBox} ${result === 'correct' ? styles.correctFeedback : styles.wrongFeedback}`}>
                                <div className={styles.feedbackIconWrapper}>
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ color: result === 'correct' ? 'var(--primary)' : '#ef4444', fontWeight: 'bold', fontSize: '1.5rem' }}
                                    >
                                        {result === 'correct' ? 'check_circle' : 'error'}
                                    </span>
                                </div>
                                <div>
                                    <h4 className={styles.feedbackTitle}>
                                        {result === 'correct' ? 'Correto! +20 pontos' : 'Incorreto.'}
                                    </h4>
                                    <p className={styles.feedbackText}>{currentQ.feedback}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
