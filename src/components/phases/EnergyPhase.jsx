'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { devices as deviceData } from '@/lib/gameData';
import { POINTS, ENERGY_TIMER_SECONDS } from '@/lib/constants';
import { generateMaze, canMove } from '@/lib/mazeGenerator';
import styles from './EnergyPhase.module.css';

const MAZE_SIZE = 7;

export default function EnergyPhase({ onScore, onFeedback, onComplete, onUpdateExtra }) {
    const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
    const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 });
    const [timeLeft, setTimeLeft] = useState(ENERGY_TIMER_SECONDS);
    const [unpluggedCount, setUnpluggedCount] = useState(0);
    const [visited, setVisited] = useState(new Set(['0-0']));
    const [mazeKey, setMazeKey] = useState(0); // for re-triggering animation
    const timerRef = useRef(null);
    const completedRef = useRef(false);

    const exitPos = { row: MAZE_SIZE - 1, col: MAZE_SIZE - 1 };
    const currentDevice = deviceData[currentDeviceIndex];

    // Generate all mazes on client only (avoids SSR hydration mismatch from Math.random)
    const [mazes] = useState(() =>
        deviceData.map(() => generateMaze(MAZE_SIZE, MAZE_SIZE))
    );

    const currentMaze = mazes[currentDeviceIndex];

    // Update extra card with time
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
                            onFeedback(`Tempo esgotado! ${unpluggedCount} aparelhos desligados.`, 'success');
                            onComplete();
                        }, 0);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [onFeedback, onComplete, unpluggedCount]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (completedRef.current) return;
            let dr = 0, dc = 0;
            if (e.key === 'ArrowUp' || e.key === 'w') dr = -1;
            else if (e.key === 'ArrowDown' || e.key === 's') dr = 1;
            else if (e.key === 'ArrowLeft' || e.key === 'a') dc = -1;
            else if (e.key === 'ArrowRight' || e.key === 'd') dc = 1;
            else return;

            e.preventDefault();
            const newR = playerPos.row + dr;
            const newC = playerPos.col + dc;

            if (newR >= 0 && newR < MAZE_SIZE && newC >= 0 && newC < MAZE_SIZE) {
                if (canMove(currentMaze, playerPos.row, playerPos.col, newR, newC)) {
                    movePlayer(newR, newC);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playerPos, currentMaze]);

    const movePlayer = useCallback((newR, newC) => {
        if (completedRef.current) return;

        setPlayerPos({ row: newR, col: newC });
        setVisited((prev) => new Set([...prev, `${newR}-${newC}`]));

        // Check if reached exit (plug)
        if (newR === exitPos.row && newC === exitPos.col) {
            onScore(POINTS.ENERGY_CORRECT);
            onFeedback(`${currentDevice.name} desligado! +50 pts`, 'success');
            const newCount = unpluggedCount + 1;
            setUnpluggedCount(newCount);

            const nextIdx = currentDeviceIndex + 1;
            if (nextIdx >= deviceData.length) {
                completedRef.current = true;
                clearInterval(timerRef.current);
                onFeedback('Todos os aparelhos desligados!', 'success');
                setTimeout(() => onComplete(), 500);
            } else {
                // Next device / maze with animation reset
                setTimeout(() => {
                    setCurrentDeviceIndex(nextIdx);
                    setPlayerPos({ row: 0, col: 0 });
                    setVisited(new Set(['0-0']));
                    setMazeKey((k) => k + 1);
                }, 300);
            }
        }
    }, [currentDeviceIndex, unpluggedCount, exitPos, currentDevice, onScore, onFeedback, onComplete]);

    const handleCellClick = useCallback((row, col) => {
        if (completedRef.current) return;
        if (canMove(currentMaze, playerPos.row, playerPos.col, row, col)) {
            movePlayer(row, col);
        }
    }, [currentMaze, playerPos, movePlayer]);

    // Determine which cells are reachable (adjacent and accessible)
    const isReachable = useCallback((r, c) => {
        return canMove(currentMaze, playerPos.row, playerPos.col, r, c);
    }, [currentMaze, playerPos]);

    if (!currentDevice || !currentMaze) return null;

    return (
        <div className={styles.container}>
            <div className={styles.arena}>
                {/* Top bar */}
                <div className={styles.topBar}>
                    <div className={styles.deviceInfo}>
                        <div className={styles.deviceIconBadge}>
                            <span className="material-symbols-outlined">{currentDevice.icon}</span>
                        </div>
                        <div>
                            <p className={styles.deviceTitle}>Desligue: {currentDevice.name}</p>
                            <p className={styles.deviceSubtitle}>{currentDevice.category} — Navegue até a tomada 🔌</p>
                        </div>
                    </div>
                    <div className={`${styles.timerBadge} ${timeLeft <= 5 ? styles.danger : ''}`}>
                        <span className="material-symbols-outlined">timer</span>
                        {timeLeft}s
                    </div>
                </div>

                {/* Progress */}
                <div className={styles.progress}>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${(unpluggedCount / deviceData.length) * 100}%` }}
                        />
                    </div>
                    <span className={styles.progressLabel}>
                        {unpluggedCount}/{deviceData.length}
                    </span>
                </div>

                {/* Maze */}
                <div className={styles.mazeWrapper} key={mazeKey}>
                    <div
                        className={styles.mazeGrid}
                        style={{
                            gridTemplateColumns: `repeat(${MAZE_SIZE}, minmax(36px, 50px))`,
                            gridTemplateRows: `repeat(${MAZE_SIZE}, minmax(36px, 50px))`,
                        }}
                    >
                        {currentMaze.map((rowArr, r) =>
                            rowArr.map((cell, c) => {
                                const isPlayer = r === playerPos.row && c === playerPos.col;
                                const isExit = r === exitPos.row && c === exitPos.col;
                                const reachable = isReachable(r, c);
                                const isVisited = visited.has(`${r}-${c}`);

                                let cellClass = styles.mazeCell;
                                if (cell.walls.top) cellClass += ` ${styles.wallTop}`;
                                if (cell.walls.right) cellClass += ` ${styles.wallRight}`;
                                if (cell.walls.bottom) cellClass += ` ${styles.wallBottom}`;
                                if (cell.walls.left) cellClass += ` ${styles.wallLeft}`;
                                if (isPlayer) cellClass += ` ${styles.player}`;
                                if (isExit) cellClass += ` ${styles.exit}`;
                                if (isVisited && !isPlayer && !isExit) cellClass += ` ${styles.visited}`;
                                if (reachable) cellClass += ` ${styles.reachable}`;
                                else if (!isPlayer) cellClass += ` ${styles.notReachable}`;

                                return (
                                    <div
                                        key={`${r}-${c}`}
                                        className={cellClass}
                                        onClick={() => handleCellClick(r, c)}
                                    >
                                        {isPlayer && <span className={styles.playerIcon}>⚡</span>}
                                        {isExit && !isPlayer && <span className={styles.exitIcon}>🔌</span>}
                                        {reachable && !isPlayer && !isExit && (
                                            <div className={styles.reachableDot} />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className={styles.instructions}>
                    <span className="material-symbols-outlined">info</span>
                    <p>Clique nas células adjacentes ou use ← ↑ → ↓ para navegar até a tomada!</p>
                </div>
            </div>
        </div>
    );
}
