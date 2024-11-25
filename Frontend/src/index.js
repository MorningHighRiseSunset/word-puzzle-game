import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './AppComponent';
import { GameProvider } from './context/GameContext';
import { PlayerProvider } from './context/PlayerContext';
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <PlayerProvider>
                <GameProvider>
                    <App />
                </GameProvider>
            </PlayerProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
