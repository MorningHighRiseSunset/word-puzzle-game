const fs = require('fs').promises;
const path = require('path');

class Dictionary {
    constructor() {
        this.words = new Set();
        this.initialized = false;
    }

    async initialize() {
        try {
            const dictionaryPath = path.join(__dirname, '../data/dictionary.txt');
            const data = await fs.readFile(dictionaryPath, 'utf8');
            this.words = new Set(data.split('\n').map(word => word.trim().toUpperCase()));
            this.initialized = true;
            console.log('Dictionary loaded successfully');
        } catch (error) {
            console.error('Failed to load dictionary:', error);
            throw error;
        }
    }

    isValidWord(word) {
        if (!this.initialized) {
            throw new Error('Dictionary not initialized');
        }
        return this.words.has(word.toUpperCase());
    }

    getPossibleWords(letters) {
        if (!this.initialized) {
            throw new Error('Dictionary not initialized');
        }
        
        const letterCounts = this.getLetterCounts(letters);
        return Array.from(this.words).filter(word => 
            this.canMakeWord(word, letterCounts)
        );
    }

    getLetterCounts(letters) {
        const counts = {};
        letters.forEach(letter => {
            counts[letter] = (counts[letter] || 0) + 1;
        });
        return counts;
    }

    canMakeWord(word, letterCounts) {
        const wordCounts = this.getLetterCounts(word.split(''));
        return Object.entries(wordCounts).every(([letter, count]) => 
            (letterCounts[letter] || 0) >= count
        );
    }
}

module.exports = new Dictionary();
