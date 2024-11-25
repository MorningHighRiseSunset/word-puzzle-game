import React from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';

const RackContainer = styled.div`
    display: flex;
    gap: 5px;
    padding: 10px;
    background: #8b4513;
    border-radius: 8px;
    margin-top: 20px;
`;

const Tile = styled.div`
    width: 40px;
    height: 40px;
    background: ${props => props.isSelected ? '#e3c16f' : '#f4d03f'};
    border: 2px solid ${props => props.isSelected ? '#b8860b' : '#333'};
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
    user-select: none;

    &:hover {
        transform: ${props => !props.isSelected && 'translateY(-5px)'};
    }
`;

const EmptySlot = styled.div`
    width: 40px;
    height: 40px;
    border: 2px dashed #666;
    border-radius: 4px;
    background: rgba(255,255,255,0.1);
`;

const Rack = ({ tiles = [], isPlayerTurn }) => {
    const gameContext = useGame();
    const selectedTile = gameContext?.selectedTile || null;
    
    const handleTileClick = (letter) => {
        if (isPlayerTurn && gameContext?.dispatch) {
            gameContext.dispatch({ 
                type: 'SELECT_TILE', 
                payload: selectedTile === letter ? null : letter 
            });
        }
    };

    return (
        <RackContainer>
            {(tiles || []).map((letter, index) => (
                letter ? (
                    <Tile
                        key={index}
                        isSelected={selectedTile === letter}
                        onClick={() => handleTileClick(letter)}
                    >
                        {letter}
                    </Tile>
                ) : (
                    <EmptySlot key={index} />
                )
            ))}
        </RackContainer>
    );
};

export default Rack;
