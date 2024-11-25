const Dictionary = require('./dictionary');

class GameLogic {
  static LETTER_VALUES = {
    'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4, 'I': 1,
    'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3, 'Q': 10, 'R': 1,
    'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10
  };

  static INITIAL_TILE_DISTRIBUTION = {
    'A': 9, 'B': 2, 'C': 2, 'D': 4, 'E': 12, 'F': 2, 'G': 3, 'H': 2, 'I': 9,
    'J': 1, 'K': 1, 'L': 4, 'M': 2, 'N': 6, 'O': 8, 'P': 2, 'Q': 1, 'R': 6,
    'S': 4, 'T': 6, 'U': 4, 'V': 2, 'W': 2, 'X': 1, 'Y': 2, 'Z': 1, '_': 2
  };

  static createInitialTileBag() {
    let tiles = [];
    Object.entries(this.INITIAL_TILE_DISTRIBUTION).forEach(([letter, count]) => {
      for (let i = 0; i < count; i++) {
        tiles.push(letter);
      }
    });
    return this.shuffleArray(tiles);
  }

  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  static isValidWord(word) {
    return Dictionary.check(word.toUpperCase());
  }

  static calculateWordScore(word, positions, board) {
    let score = 0;
    let wordMultiplier = 1;
    
    positions.forEach(({row, col}, index) => {
      let letterScore = this.LETTER_VALUES[word[index]];
      const multiplier = board[row][col].multiplier;
      
      switch(multiplier) {
        case 'DL':
          letterScore *= 2;
          break;
        case 'TL':
          letterScore *= 3;
          break;
        case 'DW':
          wordMultiplier *= 2;
          break;
        case 'TW':
          wordMultiplier *= 3;
          break;
      }
      
      score += letterScore;
    });
    
    return score * wordMultiplier;
  }

  static getConnectedWords(board, newTiles) {
    // Implementation to find all connected words formed by new tiles
    // Returns array of valid words formed
  }
}

module.exports = GameLogic;
