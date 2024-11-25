import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePlayer } from '../../context/PlayerContext';
import { useGame } from '../../context/GameContext';
import Board from '../Board';
import Rack from '../Rack';
import GameControls from '../GameControls';
import socketService from '../../services/socketService';

// ... styled components remain the same ...

const GameRoom = () => {
    const { playerName } = usePlayer();
    const gameContext = useGame();
    const [availableGames, setAvailableGames] = useState([]);
    const [currentGame, setCurrentGame] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const socket = socketService.connect();

        socket.on('gamesList', (games) => {
            setAvailableGames(games);
        });

        socket.on('gameUpdate', (gameState) => {
            setCurrentGame(gameState);
            if (gameContext?.dispatch) {
                gameContext.dispatch({ type: 'UPDATE_GAME', payload: gameState });
            }
        });

        socket.on('gameError', (errorMessage) => {
            setError(errorMessage);
            if (gameContext?.dispatch) {
                gameContext.dispatch({ type: 'SET_ERROR', payload: errorMessage });
            }
        });

        socketService.getGames();

        return () => socketService.disconnect();
    }, [gameContext]);

    // ... rest of the component remains the same ...

    return (
        <Container>
            {/* ... rest of the JSX ... */}
            <Rack 
                tiles={currentGame?.players.find(p => p.name === playerName)?.rack || []}
                isPlayerTurn={currentGame?.currentTurn === playerName}
            />
        </Container>
    );
};

export default GameRoom;
