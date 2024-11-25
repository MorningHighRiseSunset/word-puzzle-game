import React, { createContext, useContext, useReducer } from 'react';
import { usePlayer } from './PlayerContext';

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
    error: null
};

function gameReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_GAME':
            return { ...state, ...action.payload };
        case 'SELECT_TILE':
            return { ...state, selectedTile: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'RESET_GAME':
            return initialState;
        default:
            return state;
    }
}

export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { playerName } = usePlayer();

    const value = {
        ...state,
        selectedTile: state.selectedTile,
        dispatch,
        playerName
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
