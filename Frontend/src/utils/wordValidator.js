class WordValidator {
    static isValidWord(word) {
        // For now, basic validation (will be enhanced with dictionary)
        return word.length >= 2 && /^[A-Z]+$/i.test(word);
    }

    static validateWordPlacement(board, word, startRow, startCol, direction) {
        // Check if word fits on board
        if (direction === 'horizontal') {
            if (startCol + word.length > 15) return false;
        } else {
            if (startRow + word.length > 15) return false;
        }

        // Check if placement connects to existing words
        let connectsToExisting = false;
        for (let i = 0; i < word.length; i++) {
            const row = direction === 'horizontal' ? startRow : startRow + i;
            const col = direction === 'horizontal' ? startCol + i : startCol;

            if (board[row][col] && board[row][col] !== word[i]) {
                return false;
            }
            if (board[row][col]) {
                connectsToExisting = true;
            }
        }

        // First word must be placed in center
        if (!connectsToExisting && board.every(row => row.every(cell => !cell))) {
            const center = 7;
            if (direction === 'horizontal') {
                return startRow === center && startCol <= center && (startCol + word.length) > center;
            } else {
                return startCol === center && startRow <= center && (startRow + word.length) > center;
            }
        }

        return true;
    }
}

export const validateWord = WordValidator.isValidWord;
export const validateWordPlacement = WordValidator.validateWordPlacement;
