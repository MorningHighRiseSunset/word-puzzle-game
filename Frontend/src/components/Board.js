import React from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';

const BoardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(15, 40px);
    gap: 1px;
    background: #e0e0e0;
    padding: 10px;
    border: 2px solid #333;
`;

const Cell = styled.div`
    width: 40px;
    height: 40px;
    background: ${props => props.special || '#fff'};
    border: 1px solid #999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: ${props => props.isActive ? 'pointer' : 'default'};

    &:hover {
        ${props => props.isActive && `
            background: #e8f5e9;
            border-color: #4CAF50;
        `}
    }
`;

const Board = () => {
    const { board, gameStatus, selectedTile, placeTile } = useGame();

    const getSpecialCell = (row, col) => {
        // Define special cells (triple word, double word, etc.)
        if ((row === 0 || row === 14) && (col === 0 || col === 7 || col === 14)) 
            return '#ff6b6b'; // Triple Word
        if (row === col || row === 14 - col) 
            return '#ffd93d'; // Double Word
        if ((row === 3 || row === 11) && (col === 0 || col === 7 || col === 14))
            return '#87ceeb'; // Triple Letter
        if ((row === 2 || row === 12) && (col === 6 || col === 8))
            return '#98fb98'; // Double Letter
        return '#fff';
    };

    const handleCellClick = (row, col) => {
        if (gameStatus === 'active' && selectedTile && !board[row][col]) {
            placeTile(row, col, selectedTile);
        }
    };

    return (
        <BoardContainer>
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        special={getSpecialCell(rowIndex, colIndex)}
                        isActive={gameStatus === 'active' && !cell && selectedTile}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                        {cell}
                    </Cell>
                ))
            )}
        </BoardContainer>
    );
};

export default Board;
