import React from 'react';
import styled from 'styled-components';
import { PlayerProvider } from './context/PlayerContext';
import JoinGame from './components/Lobby/JoinGame';
import GameRoom from './components/Game/GameRoom';
import { usePlayer } from './context/PlayerContext';

const AppContainer = styled.div`
    min-height: 100vh;
    background: #f5f5f5;
    padding: 20px;
`;

const GameWrapper = () => {
    const { inGame, playerName } = usePlayer();

    return inGame ? <GameRoom playerName={playerName} /> : <JoinGame />;
};

function App() {
    return (
        <PlayerProvider>
            <AppContainer>
                <GameWrapper />
            </AppContainer>
        </PlayerProvider>
    );
}

export default App;
