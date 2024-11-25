import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { usePlayer } from './PlayerContext';
import socketService from '../services/socketService';
import { validateWord } from '../utils/wordValidator';
import { calculateScore } from '../utils/scoreCalculator';

const GameContext = createContext(null);

const initialState = {
    board: Array(15).fill().map(() => Array(15).fill(null)),
    tiles: Array(7).fill(null),
    selectedTile: null,
    score: 0,
    gameId: null,
    players: [],
    currentTurn: null,
    gameStatus: 'waiting',
    error: null,
    pendingWord: {
        tiles: [],
        positions: []
    }
};

function gameReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_GAME_STATE':
            return {
                ...state,
                ...action.payload,
                error: null
            };
            
        case 'SET_GAME_ID':
            return {
                ...state,
                gameId: action.payload
            };

        case 'UPDATE_BOARD':
            return {
                ...state,
                board: action.payload
            };

        case 'UPDATE_RACK':
            return {
                ...state,
                tiles: action.payload
            };

        case 'SELECT_TILE':
            return {
                ...state,
                selectedTile: action.payload
            };

        case 'ADD_PENDING_TILE':
            return {
                ...state,
                pendingWord: {
                    tiles: [...state.pendingWord.tiles, action.payload.tile],
                    positions: [...state.pendingWord.positions, action.payload.position]
                }
            };

        case 'CLEAR_PENDING_WORD':
            return {
                ...state,
                pendingWord: {
                    tiles: [],
                    positions: []
                }
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };

        case 'RESET_GAME':
            return initialState;

        default:
            return state;
    }
}

export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { playerName } = usePlayer();

    useEffect(() => {
        const socket = socketService.connect();

        socket.on('gameCreated', ({ gameId, gameState }) => {
            dispatch({ type: 'SET_GAME_ID', payload: gameId });
            dispatch({ type: 'UPDATE_GAME_STATE', payload: gameState });
        });

        socket.on('gameUpdate', (gameState) => {
            dispatch({ type: 'UPDATE_GAME_STATE', payload: gameState });
        });

        socket.on('validWord', ({ score }) => {
            dispatch({ type: 'CLEAR_PENDING_WORD' });
            // Additional score handling if needed
        });

        socket.on('invalidWord', () => {
            dispatch({ type: 'SET_ERROR', payload: 'Invalid word!' });
            // Revert pending tiles
            dispatch({ type: 'CLEAR_PENDING_WORD' });
        });

        return () => socket.disconnect();
    }, []);

    const createGame = () => {
        socketService.createGame(playerName);
    };

    const joinGame = (gameId) => {
        socketService.joinGame(gameId, playerName);
    };

    const placeTile = (row, col) => {
        if (!state.selectedTile || state.currentTurn !== playerName) return;

        const position = { row, col };
        dispatch({ 
            type: 'ADD_PENDING_TILE', 
            payload: { tile: state.selectedTile, position } 
        });

        socketService.placeTile(
            state.gameId,
            position,
            state.selectedTile
        );

        dispatch({ type: 'SELECT_TILE', payload: null });
    };

    const submitWord = () => {
        if (state.pendingWord.tiles.length < 2) {
            dispatch({ type: 'SET_ERROR', payload: 'Word must be at least 2 letters' });
            return;
        }

        const word = state.pendingWord.tiles.join('');
        if (validateWord(word)) {
            const score = calculateScore(word, state.pendingWord.positions, state.board);
            socketService.submitWord(state.gameId, {
                word,
                positions: state.pendingWord.positions,
                score
            });
        } else {
            dispatch({ type: 'SET_ERROR', payload: 'Invalid word!' });
            dispatch({ type: 'CLEAR_PENDING_WORD' });
        }
    };

    const endTurn = () => {
        if (state.currentTurn === playerName) {
            socketService.endTurn(state.gameId);
        }
    };

    const value = {
        ...state,
        createGame,
        joinGame,
        placeTile,
        submitWord,
        endTurn,
        dispatch
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
