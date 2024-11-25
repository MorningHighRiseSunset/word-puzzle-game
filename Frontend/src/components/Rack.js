import React from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';
import { LETTER_POINTS } from '../utils/letterDistribution';

const RackContainer = styled.div`
    display: flex;
    gap: 8px;
    padding: 15px;
    background: linear-gradient(to bottom, #8b4513, #654321);
    border-radius: 12px;
    margin: 20px auto;
    max-width: 500px;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    position: relative;
    
    &::before {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        right: 2px;
        height: 1px;
        background: rgba(255,255,255,0.2);
        border-radius: 12px;
    }
`;

const TileContainer = styled.div`
    position: relative;
    transition: transform 0.2s ease;

    &:hover {
        transform: ${props => !props.isSelected && 'translateY(-5px)'};
    }
`;

const Tile = styled.div`
    width: 50px;
    height: 50px;
    background: ${props => props.isSelected ? 
        'linear-gradient(to bottom right, #e3c16f, #d4af37)' : 
        'linear-gradient(to bottom right, #f4d03f, #e3c16f)'};
    border: 2px solid ${props => props.isSelected ? '#b8860b' : '#8b4513'};
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: ${props => props.isActive ? 'pointer' : 'not-allowed'};
    user-select: none;
    box-shadow: ${props => props.isSelected ? 
        '0 0 10px rgba(255,215,0,0.5)' : 
        '0 2px 4px rgba(0,0,0,0.2)'};
    position: relative;
    opacity: ${props => props.isActive ? 1 : 0.6};

    .letter {
        font-size: 1.5em;
        color: #000;
        text-shadow: 1px 1px 1px rgba(255,255,255,0.3);
    }

    .points {
        position: absolute;
        bottom: 2px;
        right: 4px;
        font-size: 0.8em;
        color: #666;
    }
`;

const EmptySlot = styled.div`
    width: 50px;
    height: 50px;
    border: 2px dashed rgba(255,255,255,0.3);
    border-radius: 6px;
    background: rgba(255,255,255,0.05);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
`;

const Rack = ({ isPlayerTurn }) => {
    const { tiles, selectedTile, dispatch } = useGame();
    
    const handleTileClick = (letter) => {
        if (!isPlayerTurn) return;
        
        dispatch({ 
            type: 'SELECT_TILE', 
            payload: selectedTile === letter ? null : letter 
        });
    };

    return (
        <RackContainer>
            {Array(7).fill(null).map((_, index) => {
                const letter = tiles?.[index] || null;
                return letter ? (
                    <TileContainer 
                        key={`${index}-${letter}`}
                        isSelected={selectedTile === letter}
                    >
                        <Tile
                            isSelected={selectedTile === letter}
                            isActive={isPlayerTurn}
                            onClick={() => handleTileClick(letter)}
                        >
                            <span className="letter">{letter}</span>
                            <span className="points">{LETTER_POINTS[letter]}</span>
                        </Tile>
                    </TileContainer>
                ) : (
                    <EmptySlot key={index} />
                );
            })}
        </RackContainer>
    );
};

export default Rack;
