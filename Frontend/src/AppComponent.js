import React from 'react';
import styled from 'styled-components';
import { usePlayer } from './context/PlayerContext';
import JoinGame from './components/Lobby/JoinGame';
import GameRoom from './components/Game/GameRoom';

const AppContainer = styled.div`
    min-height: 100vh;
    background: #f5f5f5;
    padding: 20px;
`;

function App() {
    const { inGame } = usePlayer();

    return (
        <AppContainer>
            {inGame ? <GameRoom /> : <JoinGame />}
        </AppContainer>
    );
}

export default App;
