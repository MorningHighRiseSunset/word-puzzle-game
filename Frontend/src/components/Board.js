import React from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';

const BoardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(15, minmax(40px, 1fr));
    gap: 2px;
    background: #3d2b1f;
    padding: 10px;
    border: 3px solid #3d2b1f;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    max-width: 750px;
    margin: 0 auto;
`;

const Cell = styled.div`
    aspect-ratio: 1;
    background: ${props => props.background};
    border: 1px solid rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2em;
    cursor: ${props => props.isActive ? 'pointer' : 'default'};
    position: relative;
    transition: all 0.2s ease;
    color: ${props => props.hasLetter ? '#000' : '#666'};

    &:hover {
        ${props => props.isActive && `
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        `}
    }

    &::before {
        content: '${props => props.bonus}';
        font-size: 0.6em;
        text-align: center;
        position: absolute;
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: ${props => props.hasLetter ? 0 : 0.8};
    }
`;

const SPECIAL_CELLS = {
    TW: { background: '#ff6b6b', text: 'TRIPLE\nWORD' },
    DW: { background: '#ffd93d', text: 'DOUBLE\nWORD' },
    TL: { background: '#87ceeb', text: 'TRIPLE\nLETTER' },
    DL: { background: '#98fb98', text: 'DOUBLE\nLETTER' }
};

const Board = ({ onPlaceTile, isPlayerTurn }) => {
    const { board, selectedTile } = useGame();

    const getCellType = (row, col) => {
        // Triple Word Score
        if ((row === 0 || row === 14) && (col === 0 || col === 7 || col === 14) ||
            (row === 7 && col === 0) || (row === 7 && col === 14)) {
            return 'TW';
        }
        // Double Word Score
        if (row === col || row + col === 14) {
            if (row !== 0 && row !== 14 && row !== 7) {
                return 'DW';
            }
        }
        // Triple Letter Score
        if (((row === 5 || row === 9) && (col === 1 || col === 5 || col === 9 || col === 13)) ||
            ((col === 5 || col === 9) && (row === 1 || row === 13))) {
            return 'TL';
        }
        // Double Letter Score
        if (((row === 3 || row === 11) && (col === 0 || col === 7 || col === 14)) ||
            ((col === 3 || col === 11) && (row === 0 || row === 7 || row === 14)) ||
            ((row === 6 || row === 8) && (col === 2 || col === 6 || col === 8 || col === 12)) ||
            ((col === 6 || col === 8) && (row === 2 || row === 6 || row === 8 || col === 12))) {
            return 'DL';
        }
        return null;
    };

    const handleCellClick = (row, col) => {
        if (isPlayerTurn && selectedTile && !board[row][col]) {
            onPlaceTile(row, col, selectedTile);
        }
    };

    return (
        <BoardContainer>
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const cellType = getCellType(rowIndex, colIndex);
                    const specialCell = SPECIAL_CELLS[cellType] || { background: '#f4f4f4', text: '' };
                    
                    return (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            background={specialCell.background}
                            bonus={specialCell.text}
                            hasLetter={Boolean(cell)}
                            isActive={isPlayerTurn && !cell && selectedTile}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                            {cell}
                        </Cell>
                    );
                })
            )}
        </BoardContainer>
    );
};

export default Board;
