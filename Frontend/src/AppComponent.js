import React from 'react';
import styled from 'styled-components';
import { useAuth } from './context/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Board from './components/Board';
import Rack from './components/Rack';
import GameControls from './components/GameControls';

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const GameContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AppContainer>
            <h1>Word Puzzle Online</h1>
            {!user ? (
                <div>
                    <LoginForm />
                    <RegisterForm />
                </div>
            ) : (
                <GameContainer>
                    <h2>Welcome, {user.username}!</h2>
                    <Board />
                    <GameControls />
                    <Rack />
                </GameContainer>
            )}
        </AppContainer>
    );
}

export default App;
