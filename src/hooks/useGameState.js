'use client';

import { useState, useCallback, useRef } from 'react';
import { TOTAL_PHASES } from '@/lib/constants';

export function useGameState() {
    const [score, setScore] = useState(0);
    const [currentPhase, setCurrentPhase] = useState(1);
    const [feedbacks, setFeedbacks] = useState([]);
    const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'ended'
    const feedbackIdRef = useRef(0);

    const updateScore = useCallback((points) => {
        setScore((prev) => prev + points);
    }, []);

    const showFeedback = useCallback((message, type) => {
        const id = ++feedbackIdRef.current;
        setFeedbacks((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setFeedbacks((prev) => prev.filter((f) => f.id !== id));
        }, 1500);
    }, []);

    const nextPhase = useCallback(() => {
        setCurrentPhase((prev) => {
            const next = prev + 1;
            if (next > TOTAL_PHASES) {
                setGameState('ended');
                return prev;
            }
            return next;
        });
    }, []);

    const resetGame = useCallback(() => {
        setScore(0);
        setCurrentPhase(1);
        setFeedbacks([]);
        setGameState('start');
    }, []);

    const startGame = useCallback(() => {
        setScore(0);
        setCurrentPhase(1);
        setFeedbacks([]);
        setGameState('playing');
    }, []);

    const endGame = useCallback(() => {
        setGameState('ended');
    }, []);

    const progress = Math.round(((currentPhase - 1) / TOTAL_PHASES) * 100);

    return {
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
    };
}
