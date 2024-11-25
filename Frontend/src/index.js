import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './AppComponent';
import { GameProvider } from './context/GameContext';
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <GameProvider>
                <App />
            </GameProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
