import React from 'react';
import './Board.css';

const BOARD_SIZE = 15;

// Premium square types
const PREMIUM_SQUARES = {
  TRIPLE_WORD: 'tw',
  DOUBLE_WORD: 'dw',
  TRIPLE_LETTER: 'tl',
  DOUBLE_LETTER: 'dl',
  NORMAL: 'normal'
};

// Premium square positions
const premiumSquares = {
  tw: [[0, 0], [0, 7], [0, 14], [7, 0], [7, 14], [14, 0], [14, 7], [14, 14]],
  dw: [[1, 1], [2, 2], [3, 3], [4, 4], [13, 13], [12, 12], [11, 11], [10, 10], 
       [1, 13], [2, 12], [3, 11], [4, 10], [13, 1], [12, 2], [11, 3], [10, 4]],
  tl: [[1, 5], [1, 9], [5, 1], [5, 5], [5, 9], [5, 13], 
       [9, 1], [9, 5], [9, 9], [9, 13], [13, 5], [13, 9]],
  dl: [[0, 3], [0, 11], [2, 6], [2, 8], [3, 0], [3, 7], [3, 14],
       [6, 2], [6, 6], [6, 8], [6, 12], [7, 3], [7, 11],
       [8, 2], [8, 6], [8, 8], [8, 12], [11, 0], [11, 7], [11, 14],
       [12, 6], [12, 8], [14, 3], [14, 11]]
};

const getPremiumSquareType = (row, col) => {
  for (const [type, positions] of Object.entries(premiumSquares)) {
    if (positions.some(([r, c]) => r === row && c === col)) {
      return type;
    }
  }
  return PREMIUM_SQUARES.NORMAL;
};

const Board = ({ board = Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(null)), playedTiles = [], onCellClick }) => {
  // Initialize empty board if not provided
  const boardData = board || Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(null));

  const renderCell = (row, col) => {
    const playedTile = playedTiles.find(
      tile => tile.position.row === row && tile.position.col === col
    );
    const boardTile = boardData[row][col];
    const premiumType = getPremiumSquareType(row, col);
    
    const tile = playedTile || boardTile;
    
    const handleClick = () => {
      if (onCellClick && !boardTile && !playedTile) {
        onCellClick({ row, col });
      }
    };

    return (
      <div 
        key={`${row}-${col}`}
        className={`board-cell ${premiumType} ${tile ? 'occupied' : ''}`}
        onClick={handleClick}
      >
        {tile && (
          <div className="tile">
            <span className="letter">{tile.letter}</span>
            <span className="score">{tile.value}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="board">
      {Array(BOARD_SIZE).fill(null).map((_, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {Array(BOARD_SIZE).fill(null).map((_, colIndex) => 
            renderCell(rowIndex, colIndex)
          )}
        </div>
      ))}
    </div>
  );
};

export default Board;
