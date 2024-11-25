class WordValidator {
    static DIRECTIONS = {
        HORIZONTAL: 'horizontal',
        VERTICAL: 'vertical'
    };

    static isValidPlacement(board, word, startRow, startCol, direction) {
        // Check if word fits on board
        if (direction === this.DIRECTIONS.HORIZONTAL) {
            if (startCol + word.length > 15) return false;
        } else {
            if (startRow + word.length > 15) return false;
        }

        // Check if placement connects to existing words
        let connectsToExisting = false;
        let hasAdjacentTiles = false;

        for (let i = 0; i < word.length; i++) {
            const row = direction === this.DIRECTIONS.HORIZONTAL ? startRow : startRow + i;
            const col = direction === this.DIRECTIONS.HORIZONTAL ? startCol + i : startCol;

            // Check if space is already occupied
            if (board[row][col]) {
                if (board[row][col] !== word[i]) return false;
                connectsToExisting = true;
            }

            // Check adjacent tiles
            if (this.hasAdjacentTiles(board, row, col)) {
                hasAdjacentTiles = true;
            }
        }

        // First word must be placed in center
        if (board.every(row => row.every(cell => !cell))) {
            return this.crossesCenterSquare(startRow, startCol, word.length, direction);
        }

        return connectsToExisting || hasAdjacentTiles;
    }

    static hasAdjacentTiles(board, row, col) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        return directions.some(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            return (
                newRow >= 0 && 
                newRow < 15 && 
                newCol >= 0 && 
                newCol < 15 && 
                board[newRow][newCol]
            );
        });
    }

    static crossesCenterSquare(startRow, startCol, length, direction) {
        const center = 7;
        if (direction === this.DIRECTIONS.HORIZONTAL) {
            return startRow === center && 
                   startCol <= center && 
                   startCol + length > center;
        } else {
            return startCol === center && 
                   startRow <= center && 
                   startRow + length > center;
        }
    }

    static getConnectedWords(board, newWord, startRow, startCol, direction) {
        const words = [newWord];
        
        // Check for perpendicular words formed
        for (let i = 0; i < newWord.length; i++) {
            const row = direction === this.DIRECTIONS.HORIZONTAL ? startRow : startRow + i;
            const col = direction === this.DIRECTIONS.HORIZONTAL ? startCol + i : startCol;
            
            const perpWord = this.getPerpendicularWord(board, row, col, direction);
            if (perpWord && perpWord.length > 1) {
                words.push(perpWord);
            }
        }

        return words;
    }

    static getPerpendicularWord(board, row, col, direction) {
        const perpDirection = direction === this.DIRECTIONS.HORIZONTAL ? 
            this.DIRECTIONS.VERTICAL : this.DIRECTIONS.HORIZONTAL;
        
        let word = '';
        let startPos = direction === this.DIRECTIONS.HORIZONTAL ? row : col;

        // Find start of word
        while (startPos > 0 && board[direction === this.DIRECTIONS.HORIZONTAL ? startPos - 1 : row][direction === this.DIRECTIONS.HORIZONTAL ? col : startPos - 1]) {
            startPos--;
        }

        // Build word
        let pos = startPos;
        while (pos < 15 && board[direction === this.DIRECTIONS.HORIZONTAL ? pos : row][direction === this.DIRECTIONS.HORIZONTAL ? col : pos]) {
            word += board[direction === this.DIRECTIONS.HORIZONTAL ? pos : row][direction === this.DIRECTIONS.HORIZONTAL ? col : pos];
            pos++;
        }

        return word;
    }
}

export default WordValidator;
