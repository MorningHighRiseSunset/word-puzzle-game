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
    min-height: 50px;
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
    transition: all 0.2s ease;

    &:hover {
        transform: ${props => !props.isSelected && 'translateY(-5px)'};
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
`;

const EmptySlot = styled.div`
    width: 40px;
    height: 40px;
    border: 2px dashed #666;
    border-radius: 4px;
    background: rgba(255,255,255,0.1);
`;

const Rack = () => {
    const { rack, selectedTile, dispatch, ACTIONS } = useGame();

    const handleTileClick = (letter, index) => {
        if (selectedTile === letter) {
            dispatch({ type: ACTIONS.SELECT_TILE, payload: null });
        } else {
            dispatch({ type: ACTIONS.SELECT_TILE, payload: letter });
        }
    };

    return (
        <RackContainer>
            {rack.map((letter, index) => (
                letter ? (
                    <Tile
                        key={index}
                        isSelected={selectedTile === letter}
                        onClick={() => handleTileClick(letter, index)}
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
