import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import socketService from '../services/socketService';
import { getRandomTiles, calculateWordScore } from '../utils/gameUtils';

const GameContext = createContext(null);

const initialState = {
    board: Array(15).fill().map(() => Array(15).fill(null)),
    rack: Array(7).fill(null),
    score: 0,
    gameId: null,
    players: [],
    currentTurn: null,
    gameStatus: 'waiting',
    selectedTile: null,
    error: null,
    validWords: [],
    bagOfTiles: []
};

const ACTIONS = {
    SET_BOARD: 'SET_BOARD',
    UPDATE_CELL: 'UPDATE_CELL',
    SET_RACK: 'SET_RACK',
    UPDATE_SCORE: 'UPDATE_SCORE',
    SET_GAME_ID: 'SET_GAME_ID',
    SET_PLAYERS: 'SET_PLAYERS',
    SET_CURRENT_TURN: 'SET_CURRENT_TURN',
    SET_GAME_STATUS: 'SET_GAME_STATUS',
    SELECT_TILE: 'SELECT_TILE',
    SET_ERROR: 'SET_ERROR',
    UPDATE_GAME_STATE: 'UPDATE_GAME_STATE',
    RESET_GAME: 'RESET_GAME'
};

function gameReducer(state, action) {
    switch (action.type) {
        case ACTIONS.UPDATE_GAME_STATE:
            return {
                ...state,
                ...action.payload,
                error: null
            };
            
        case ACTIONS.SET_BOARD:
            return { ...state, board: action.payload };
            
        case ACTIONS.UPDATE_CELL:
            const { row, col, value } = action.payload;
            const newBoard = [...state.board];
            newBoard[row][col] = value;
            return { ...state, board: newBoard };
            
        case ACTIONS.SET_RACK:
            return { ...state, rack: action.payload };
            
        case ACTIONS.UPDATE_SCORE:
            return { ...state, score: action.payload };
            
        case ACTIONS.SET_GAME_ID:
            return { ...state, gameId: action.payload };
            
        case ACTIONS.SET_PLAYERS:
            return { ...state, players: action.payload };
            
        case ACTIONS.SET_CURRENT_TURN:
            return { ...state, currentTurn: action.payload };
            
        case ACTIONS.SET_GAME_STATUS:
            return { ...state, gameStatus: action.payload };
            
        case ACTIONS.SELECT_TILE:
            return { ...state, selectedTile: action.payload };
            
        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload };
            
        case ACTIONS.RESET_GAME:
            return initialState;
            
        default:
            return state;
    }
}

export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { user } = useAuth();

    useEffect(() => {
        if (user && state.gameId) {
            socketService.joinGame(state.gameId, user.id);
        }
    }, [user, state.gameId]);

    const createGame = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            dispatch({ type: ACTIONS.SET_GAME_ID, payload: data._id });
            return data;
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to create game' });
        }
    };

    const joinGame = async (gameId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/join/${gameId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            dispatch({ type: ACTIONS.UPDATE_GAME_STATE, payload: data });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to join game' });
        }
    };

    const placeTile = (row, col, letter) => {
        if (state.gameStatus !== 'active' || state.currentTurn !== user?.id) {
            return;
        }

        socketService.placeTile({ row, col }, letter, user.id);
    };

    const submitWord = async (word, positions) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ word, positions })
            });
            const data = await response.json();
            
            if (data.valid) {
                socketService.submitWord(word, positions, user.id);
            } else {
                dispatch({ type: ACTIONS.SET_ERROR, payload: 'Invalid word' });
            }
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to validate word' });
        }
    };

    const endTurn = () => {
        if (state.currentTurn === user?.id) {
            socketService.endTurn(user.id);
        }
    };

    const value = {
        ...state,
        createGame,
        joinGame,
        placeTile,
        submitWord,
        endTurn,
        dispatch,
        ACTIONS
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}

export default GameContext;
