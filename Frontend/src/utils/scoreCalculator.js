class ScoreCalculator {
    static LETTER_VALUES = {
        'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1,
        'F': 4, 'G': 2, 'H': 4, 'I': 1, 'J': 8,
        'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1,
        'P': 3, 'Q': 10, 'R': 1, 'S': 1, 'T': 1,
        'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4,
        'Z': 10
    };

    static PREMIUM_SQUARES = {
        TRIPLE_WORD: [
            [0, 0], [0, 7], [0, 14],
            [7, 0], [7, 14],
            [14, 0], [14, 7], [14, 14]
        ],
        DOUBLE_WORD: [
            [1, 1], [2, 2], [3, 3], [4, 4],
            [13, 13], [12, 12], [11, 11], [10, 10],
            [1, 13], [2, 12], [3, 11], [4, 10],
            [13, 1], [12, 2], [11, 3], [10, 4]
        ],
        TRIPLE_LETTER: [
            [1, 5], [1, 9],
            [5, 1], [5, 5], [5, 9], [5, 13],
            [9, 1], [9, 5], [9, 9], [9, 13],
            [13, 5], [13, 9]
        ],
        DOUBLE_LETTER: [
            [0, 3], [0, 11],
            [2, 6], [2, 8],
            [3, 0], [3, 7], [3, 14],
            [6, 2], [6, 6], [6, 8], [6, 12],
            [7, 3], [7, 11],
            [8, 2], [8, 6], [8, 8], [8, 12],
            [11, 0], [11, 7], [11, 14],
            [12, 6], [12, 8],
            [14, 3], [14, 11]
        ]
    };

    static calculateWordScore(word, positions, board, isFirstWord = false) {
        let wordScore = 0;
        let wordMultiplier = 1;
        
        positions.forEach(({row, col}, index) => {
            const letter = word[index].toUpperCase();
            let letterScore = this.LETTER_VALUES[letter] || 0;
            
            // Apply letter multipliers
            if (this.isPremiumSquare(row, col, 'TRIPLE_LETTER') && !board[row][col]) {
                letterScore *= 3;
            } else if (this.isPremiumSquare(row, col, 'DOUBLE_LETTER') && !board[row][col]) {
                letterScore *= 2;
            }
            
            // Accumulate word multipliers
            if (!board[row][col]) {
                if (this.isPremiumSquare(row, col, 'TRIPLE_WORD')) {
                    wordMultiplier *= 3;
                } else if (this.isPremiumSquare(row, col, 'DOUBLE_WORD')) {
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
        
        // First word bonus
        if (isFirstWord) {
            wordScore *= 2;
        }
        
        return wordScore;
    }

    static isPremiumSquare(row, col, type) {
        return this.PREMIUM_SQUARES[type].some(
            ([r, c]) => r === row && c === col
        );
    }

    static calculateTotalScore(words, positions, board, isFirstWord = false) {
        return words.reduce((total, word, index) => {
            return total + this.calculateWordScore(
                word,
                positions[index],
                board,
                index === 0 && isFirstWord
            );
        }, 0);
    }
}

export default ScoreCalculator;
