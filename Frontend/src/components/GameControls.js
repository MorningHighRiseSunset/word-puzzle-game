import React from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';

const ControlsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 20px 0;
    width: 100%;
    max-width: 600px;
`;

const ButtonRow = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s ease;
    
    background-color: ${props => {
        if (props.variant === 'primary') return '#4CAF50';
        if (props.variant === 'secondary') return '#2196F3';
        if (props.variant === 'danger') return '#f44336';
        return '#757575';
    }};
    
    color: white;

    &:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-2px);
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

const GameInfo = styled.div`
    text-align: center;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
    margin-bottom: 10px;
`;

const ErrorMessage = styled.div`
    color: #f44336;
    text-align: center;
    padding: 10px;
    background-color: #ffebee;
    border-radius: 5px;
    margin-bottom: 10px;
`;

const GameControls = () => {
    const { 
        gameStatus, 
        currentTurn, 
        score, 
        error,
        startGame,
        endTurn,
        forfeitGame
    } = useGame();
    
    const { user } = useAuth();

    const isPlayerTurn = currentTurn === user?.id;
    const isGameActive = gameStatus === 'active';

    return (
        <ControlsContainer>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <GameInfo>
                <div>Status: {gameStatus.charAt(0).toUpperCase() + gameStatus.slice(1)}</div>
                <div>Score: {score}</div>
                {isGameActive && (
                    <div>
                        {isPlayerTurn ? "Your turn!" : "Waiting for opponent..."}
                    </div>
                )}
            </GameInfo>

            <ButtonRow>
                {gameStatus === 'waiting' && (
                    <Button 
                        variant="primary" 
                        onClick={startGame}
                    >
                        Start Game
                    </Button>
                )}

                {isGameActive && (
                    <>
                        <Button
                            variant="secondary"
                            onClick={endTurn}
                            disabled={!isPlayerTurn}
                        >
                            End Turn
                        </Button>
                        <Button
                            variant="danger"
                            onClick={forfeitGame}
                        >
                            Forfeit
                        </Button>
                    </>
                )}
            </ButtonRow>
        </ControlsContainer>
    );
};

export default GameControls;
