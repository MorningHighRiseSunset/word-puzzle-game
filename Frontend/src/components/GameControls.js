import React from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';

const ControlsContainer = styled.div`
    display: flex;
    gap: 10px;
    margin: 20px 0;
    justify-content: center;
`;

const Button = styled.button`
    padding: 10px 20px;
    background: ${props => props.variant === 'primary' ? '#4CAF50' : '#f44336'};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;

    &:disabled {
        background: #cccccc;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        opacity: 0.9;
    }
`;

const GameControls = ({ onEndTurn, isPlayerTurn, gameStatus }) => {
    const { state } = useGame();

    return (
        <ControlsContainer>
            <Button
                variant="primary"
                onClick={onEndTurn}
                disabled={!isPlayerTurn || gameStatus !== 'active'}
            >
                End Turn
            </Button>
        </ControlsContainer>
    );
};

export default GameControls;
