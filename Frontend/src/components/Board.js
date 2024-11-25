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

const Board = ({ onPlaceTile, isPlayerTurn }) => {
    const { state } = useGame();
    const { board } = state || { board: Array(15).fill().map(() => Array(15).fill(null)) };

    const getSpecialCell = (row, col) => {
        if ((row === 0 || row === 14) && (col === 0 || col === 7 || col === 14)) 
            return '#ff6b6b';
        if (row === col || row === 14 - col) 
            return '#ffd93d';
        return '#fff';
    };

    const handleCellClick = (row, col) => {
        if (isPlayerTurn && !board[row][col]) {
            onPlaceTile(row, col);
        }
    };

    return (
        <BoardContainer>
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        special={getSpecialCell(rowIndex, colIndex)}
                        isActive={isPlayerTurn && !cell}
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
