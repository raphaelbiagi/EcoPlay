'use client';

import { useCallback, useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGameState } from '@/hooks/useGameState';
import { useSocket } from '@/hooks/useSocket';
import { PHASE_CONFIG } from '@/lib/constants';
import Header from '@/components/ui/Header';
import ProgressTracker from '@/components/ui/ProgressTracker';
import ScoreCard from '@/components/ui/ScoreCard';
import FeedbackToast from '@/components/ui/FeedbackToast';
import PhaseTransition from '@/components/ui/PhaseTransition';
import FloatingRanking from '@/components/ui/FloatingRanking';
import RecyclingPhase from '@/components/phases/RecyclingPhase';
import EnergyPhase from '@/components/phases/EnergyPhase';
import QuizPhase from '@/components/phases/QuizPhase';
import EndScreen from '@/components/game/EndScreen';
import styles from './page.module.css';

function GameContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const playerName = searchParams.get('name') || 'Jogador';

    const {
        score,
        currentPhase,
        feedbacks,
        gameState,
        progress,
        updateScore,
        showFeedback,
        nextPhase,
        resetGame,
        startGame,
        endGame,
    } = useGameState();

    const { ranking, isConnected, joinGame, sendScore, finishGame } = useSocket();

    const [scoreFeedback, setScoreFeedback] = useState('');
    const [extraValue, setExtraValue] = useState(PHASE_CONFIG[1].extraValue);
    const [showTransition, setShowTransition] = useState(true);
    const [transitionPhase, setTransitionPhase] = useState(1);
    const scoreRef = useRef(0);

    // Join game on mount
    useEffect(() => {
        if (gameState === 'start') {
            startGame();
            joinGame(playerName);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync score to server via ref (avoids stale closures)
    useEffect(() => {
        scoreRef.current = score;
        if (score > 0) {
            sendScore(score);
        }
    }, [score, sendScore]);

    const handleTransitionFinish = useCallback(() => {
        setShowTransition(false);
    }, []);

    const handleScore = useCallback((points) => {
        updateScore(points);
        setScoreFeedback(`+${points}pts`);
        setTimeout(() => setScoreFeedback(''), 2000);
    }, [updateScore]);

    const handleComplete = useCallback(() => {
        const nextP = currentPhase + 1;
        if (nextP > 3) {
            endGame();
            // Score is already synced via useEffect, just signal finish
            finishGame();
        } else {
            // Show transition for next phase
            setTransitionPhase(nextP);
            setShowTransition(true);
            setTimeout(() => {
                nextPhase();
                setExtraValue(PHASE_CONFIG[nextP]?.extraValue || '');
            }, 1500);
        }
    }, [currentPhase, nextPhase, endGame, finishGame]);

    const handleUpdateExtra = useCallback((value) => {
        setExtraValue(value);
    }, []);

    const handleRestart = useCallback(() => {
        resetGame();
        router.push('/');
    }, [resetGame, router]);

    // End screen
    if (gameState === 'ended') {
        return (
            <>
                <div className="bg-decorations">
                    <div className="icon">
                        <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>park</span>
                    </div>
                    <div className="icon">
                        <span className="material-symbols-outlined" style={{ fontSize: '150px' }}>solar_power</span>
                    </div>
                </div>
                <FeedbackToast feedbacks={feedbacks} />
                <EndScreen score={score} onRestart={handleRestart} />
                <FloatingRanking ranking={ranking} currentPlayerName={playerName} />
            </>
        );
    }

    const config = PHASE_CONFIG[currentPhase] || PHASE_CONFIG[1];

    return (
        <>
            {/* Phase Transition Overlay */}
            {showTransition && (
                <PhaseTransition phase={transitionPhase} onFinish={handleTransitionFinish} />
            )}

            <FeedbackToast feedbacks={feedbacks} />
            <Header variant="game" />

            <main className={styles.main}>
                {/* Status Row */}
                <div className={styles.statusGrid}>
                    <ProgressTracker
                        phaseNumber={currentPhase}
                        title={config.title}
                        progress={progress}
                    />
                    <div className={styles.cardsRow}>
                        <ScoreCard label="Pontuação" value={score} feedback={scoreFeedback} />
                        <ScoreCard label={config.extraLabel} value={extraValue} />
                    </div>
                </div>

                {/* Phase Area */}
                <div className={styles.phaseArea}>
                    {currentPhase === 1 && (
                        <RecyclingPhase
                            onScore={handleScore}
                            onFeedback={showFeedback}
                            onComplete={handleComplete}
                            onUpdateExtra={handleUpdateExtra}
                        />
                    )}
                    {currentPhase === 2 && (
                        <EnergyPhase
                            onScore={handleScore}
                            onFeedback={showFeedback}
                            onComplete={handleComplete}
                            onUpdateExtra={handleUpdateExtra}
                        />
                    )}
                    {currentPhase === 3 && (
                        <QuizPhase
                            onScore={handleScore}
                            onFeedback={showFeedback}
                            onComplete={handleComplete}
                            onUpdateExtra={handleUpdateExtra}
                        />
                    )}
                </div>

                {/* Floating Ranking */}
                <FloatingRanking ranking={ranking} currentPlayerName={playerName} />

                {/* Controls Footer */}
                <div className={styles.controls}>
                    <div className={styles.controlButtons}>
                        <button className={styles.controlBtn}>
                            <span className="material-symbols-outlined">pause</span> Pausar
                        </button>
                        <button className={styles.controlBtn}>
                            <span className="material-symbols-outlined">volume_up</span>
                        </button>
                    </div>
                    <div className={styles.healthSection}>
                        <div className={styles.hearts}>
                            <div className={styles.heart}>
                                <span className="material-symbols-outlined">favorite</span>
                            </div>
                            <div className={styles.heart}>
                                <span className="material-symbols-outlined">favorite</span>
                            </div>
                            <div className={styles.heart}>
                                <span className="material-symbols-outlined">favorite</span>
                            </div>
                        </div>
                        <p className={styles.healthLabel}>PLANETA SAUDÁVEL</p>
                    </div>
                </div>
            </main>
        </>
    );
}

export default function GamePage() {
    return (
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
            <GameContent />
        </Suspense>
    );
}
