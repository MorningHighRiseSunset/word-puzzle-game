import React from 'react';
import { GameProvider } from './context/GameContext';
import { PlayerProvider } from './context/PlayerContext';
import GameRoom from './components/Game/GameRoom';
import ErrorBoundary from './components/ErrorBoundary';

const AppComponent = () => {
  return (
    <ErrorBoundary>
      <GameProvider>
        <PlayerProvider>
          <div className="app">
            <GameRoom />
          </div>
        </PlayerProvider>
      </GameProvider>
    </ErrorBoundary>
  );
};

export default AppComponent;
