import { useEffect, useCallback } from 'react';
import socketService from '../services/socketService';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';

export const useSocket = () => {
    const { dispatch, ACTIONS } = useGame();
    const { user } = useAuth();

    const initializeSocket = useCallback(() => {
        const socket = socketService.connect();

        socket.on('playerJoined', ({ userId, gameState }) => {
            dispatch({ type: ACTIONS.UPDATE_GAME_STATE, payload: gameState });
        });

        socket.on('tilePlaced', ({ position, letter, board }) => {
            dispatch({ type: ACTIONS.SET_BOARD, payload: board });
        });

        socket.on('wordSubmitted', ({ word, score, userId, gameState }) => {
            dispatch({ type: ACTIONS.UPDATE_GAME_STATE, payload: gameState });
        });

        socket.on('turnEnded', ({ nextPlayer, gameState }) => {
            dispatch({ type: ACTIONS.UPDATE_GAME_STATE, payload: gameState });
        });

        socket.on('playerLeft', (playerId) => {
            dispatch({ 
                type: ACTIONS.SET_ERROR, 
                payload: 'A player has left the game' 
            });
        });

        return socket;
    }, [dispatch, ACTIONS]);

    useEffect(() => {
        const socket = initializeSocket();

        return () => {
            socketService.disconnect();
        };
    }, [initializeSocket]);

    return socketService;
};
