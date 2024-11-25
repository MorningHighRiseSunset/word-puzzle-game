import React, { createContext, useState, useCallback, useContext } from 'react';

export const PlayerContext = createContext();

const initialPlayerState = {
  playerId: null,
  username: '',
  isReady: false,
  tiles: [],
  score: 0,
};

// Custom hook to use the player context
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const [playerState, setPlayerState] = useState(initialPlayerState);

  const updatePlayerState = useCallback((newState) => {
    setPlayerState(prevState => ({
      ...prevState,
      ...newState,
    }));
  }, []);

  const setPlayerId = useCallback((id) => {
    setPlayerState(prevState => ({
      ...prevState,
      playerId: id,
    }));
  }, []);

  const setUsername = useCallback((username) => {
    setPlayerState(prevState => ({
      ...prevState,
      username,
    }));
  }, []);

  const updateTiles = useCallback((tiles) => {
    setPlayerState(prevState => ({
      ...prevState,
      tiles,
    }));
  }, []);

  const updateScore = useCallback((score) => {
    setPlayerState(prevState => ({
      ...prevState,
      score,
    }));
  }, []);

  const resetPlayer = useCallback(() => {
    setPlayerState(initialPlayerState);
  }, []);

  const value = {
    playerState,
    updatePlayerState,
    setPlayerId,
    setUsername,
    updateTiles,
    updateScore,
    resetPlayer,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
