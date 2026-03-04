'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket() {
    const [ranking, setRanking] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io({
            transports: ['websocket', 'polling'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('ranking:update', (data) => {
            setRanking(data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const joinGame = useCallback((name) => {
        socketRef.current?.emit('player:join', name);
    }, []);

    const sendScore = useCallback((score) => {
        socketRef.current?.emit('player:score', score);
    }, []);

    const finishGame = useCallback(() => {
        socketRef.current?.emit('player:finish');
    }, []);

    return {
        ranking,
        isConnected,
        joinGame,
        sendScore,
        finishGame,
    };
}
