// Points for each letter
export const LETTER_POINTS = {
    'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1,
    'F': 4, 'G': 2, 'H': 4, 'I': 1, 'J': 8,
    'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1,
    'P': 3, 'Q': 10, 'R': 1, 'S': 1, 'T': 1,
    'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4,
    'Z': 10
};

// Initial distribution of letters
export const INITIAL_TILE_DISTRIBUTION = {
    'A': 9, 'B': 2, 'C': 2, 'D': 4, 'E': 12,
    'F': 2, 'G': 3, 'H': 2, 'I': 9, 'J': 1,
    'K': 1, 'L': 4, 'M': 2, 'N': 6, 'O': 8,
    'P': 2, 'Q': 1, 'R': 6, 'S': 4, 'T': 6,
    'U': 4, 'V': 2, 'W': 2, 'X': 1, 'Y': 2,
    'Z': 1
};

// Calculate word score
export const calculateWordScore = (word, positions, board) => {
    let wordMultiplier = 1;
    let totalScore = 0;

    word.split('').forEach((letter, index) => {
        let letterScore = LETTER_POINTS[letter.toUpperCase()];
        const { row, col } = positions[index];
        const cell = board[row][col];

        // Apply letter multipliers
        if (cell.includes('DL')) letterScore *= 2;
        if (cell.includes('TL')) letterScore *= 3;

        // Store word multipliers for later
        if (cell.includes('DW')) wordMultiplier *= 2;
        if (cell.includes('TW')) wordMultiplier *= 3;

        totalScore += letterScore;
    });

    return totalScore * wordMultiplier;
};

// Check if coordinates are within board bounds
export const isWithinBounds = (row, col) => {
    return row >= 0 && row < 15 && col >= 0 && col < 15;
};

// Get random tiles from bag
export const getRandomTiles = (count, currentBag) => {
    const tiles = [];
    const bagCopy = [...currentBag];

    for (let i = 0; i < count; i++) {
        if (bagCopy.length === 0) break;
        const randomIndex = Math.floor(Math.random() * bagCopy.length);
        tiles.push(bagCopy.splice(randomIndex, 1)[0]);
    }

    return {
        tiles,
        remainingBag: bagCopy
    };
};
