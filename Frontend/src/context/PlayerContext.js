import React, { createContext, useContext, useState } from 'react';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
    const [playerName, setPlayerName] = useState('');
    const [inGame, setInGame] = useState(false);

    const joinLobby = (name) => {
        setPlayerName(name);
        setInGame(true);
    };

    const leaveLobby = () => {
        setPlayerName('');
        setInGame(false);
    };

    return (
        <PlayerContext.Provider value={{
            playerName,
            inGame,
            joinLobby,
            leaveLobby
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};
