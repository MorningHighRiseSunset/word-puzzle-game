const LETTER_POINTS = {
    'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1,
    'F': 4, 'G': 2, 'H': 4, 'I': 1, 'J': 8,
    'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1,
    'P': 3, 'Q': 10, 'R': 1, 'S': 1, 'T': 1,
    'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4,
    'Z': 10, ' ': 0
};

const BONUS_SQUARES = {
    'TW': [[0, 0], [0, 7], [0, 14], [7, 0], [7, 14], [14, 0], [14, 7], [14, 14]],
    'DW': [[1, 1], [2, 2], [3, 3], [4, 4], [13, 13], [12, 12], [11, 11], [10, 10],
           [1, 13], [2, 12], [3, 11], [4, 10], [13, 1], [12, 2], [11, 3], [10, 4]],
    'TL': [[1, 5], [1, 9], [5, 1], [5, 5], [5, 9], [5, 13], [9, 1], [9, 5], [9, 9], [9, 13], [13, 5], [13, 9]],
    'DL': [[0, 3], [0, 11], [2, 6], [2, 8], [3, 0], [3, 7], [3, 14], [6, 2], [6, 6], [6, 8], [6, 12],
           [7, 3], [7, 11], [8, 2], [8, 6], [8, 8], [8, 12], [11, 0], [11, 7], [11, 14], [12, 6], [12, 8],
           [14, 3], [14, 11]]
};

function isPositionInList(position, list) {
    return list.some(([row, col]) => row === position.row && col === position.col);
}

function calculateWordScore(word, positions, board) {
    let wordScore = 0;
    let wordMultiplier = 1;

    positions.forEach((position, index) => {
        let letterScore = LETTER_POINTS[word[index].toUpperCase()] || 0;
        
        // Only apply bonuses if the square hasn't been used before
        if (!board[position.row][position.col]) {
            if (isPositionInList(position, BONUS_SQUARES.TL)) {
                letterScore *= 3;
            } else if (isPositionInList(position, BONUS_SQUARES.DL)) {
                letterScore *= 2;
            }
            
            if (isPositionInList(position, BONUS_SQUARES.TW)) {
                wordMultiplier *= 3;
            } else if (isPositionInList(position, BONUS_SQUARES.DW)) {
                wordMultiplier *= 2;
            }
        }
        
        wordScore += letterScore;
    });

    wordScore *= wordMultiplier;

    // Bonus for using all 7 tiles
    if (positions.length === 7) {
        wordScore += 50;
    }

    return wordScore;
}

function calculateTotalScore(mainWord, connectedWords, positions, board) {
    let totalScore = calculateWordScore(mainWord, positions, board);
    
    connectedWords.forEach((word, index) => {
        totalScore += calculateWordScore(word.word, word.positions, board);
    });

    return totalScore;
}

export { calculateWordScore, calculateTotalScore as calculateScore, LETTER_POINTS };
