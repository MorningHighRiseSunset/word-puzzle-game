import React, { createContext, useState, useCallback } from 'react';

export const GameContext = createContext();

const initialGameState = {
  gameId: null,
  board: Array(15).fill(Array(15).fill(null)), // Initialize empty 15x15 board
  players: [],
  currentPlayer: null,
  status: 'waiting',
  winner: null,
  turnTimeLeft: null,
  letters: [],
  isGameOver: false,
  errorMessage: null,
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(initialGameState);

  const updateGameState = useCallback((newState) => {
    setGameState(prevState => ({
      ...prevState,
      ...newState,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  const updateBoard = useCallback((newBoard) => {
    setGameState(prevState => ({
      ...prevState,
      board: newBoard,
    }));
  }, []);

  const updatePlayers = useCallback((players) => {
    setGameState(prevState => ({
      ...prevState,
      players,
    }));
  }, []);

  const setError = useCallback((errorMessage) => {
    setGameState(prevState => ({
      ...prevState,
      errorMessage,
    }));
  }, []);

  const clearError = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      errorMessage: null,
    }));
  }, []);

  const value = {
    gameState,
    updateGameState,
    resetGame,
    updateBoard,
    updatePlayers,
    setError,
    clearError,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
