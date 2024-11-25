import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePlayer } from '../../context/PlayerContext';
import { useGame } from '../../context/GameContext';
import Board from '../Board';
import Rack from '../Rack';
import GameControls from '../GameControls';
import socketService from '../../services/socketService';

const GameContainer = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

const Button = styled.button`
    padding: 10px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 5px;

    &:hover {
        background: #45a049;
    }

    &:disabled {
        background: #cccccc;
    }
`;

const GamesList = styled.div`
    display: grid;
    gap: 15px;
    margin: 20px 0;
`;

const GameItem = styled.div`
    padding: 15px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const PlayersList = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
`;

const PlayerCard = styled.div`
    padding: 10px;
    background: ${props => props.isCurrentTurn ? '#e8f5e9' : '#f5f5f5'};
    border-radius: 8px;
    min-width: 150px;

    h3 {
        margin: 0;
        color: ${props => props.isCurrentTurn ? '#2e7d32' : '#333'};
    }
`;

const StatusMessage = styled.div`
    text-align: center;
    margin: 20px 0;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 4px;
`;

const GameRoom = () => {
    const { playerName } = usePlayer();
    const [availableGames, setAvailableGames] = useState([]);
    const [currentGame, setCurrentGame] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const socket = socketService.connect();

        socket.on('gamesList', (games) => {
            setAvailableGames(games || []);
        });

        socket.on('gameUpdate', (gameState) => {
            setCurrentGame(gameState);
            setError(null);
        });

        socket.on('gameError', (errorMessage) => {
            setError(errorMessage);
        });

        // Request initial games list
        socketService.getGames();

        return () => socket.disconnect();
    }, []);

    const createGame = () => {
        try {
            socketService.createGame({ playerName });
        } catch (err) {
            setError('Failed to create game. Please try again.');
        }
    };

    const joinGame = (gameId) => {
        try {
            socketService.joinGame({ gameId, playerName });
        } catch (err) {
            setError('Failed to join game. Please try again.');
        }
    };

    const handlePlaceTile = (row, col, letter) => {
        if (!currentGame || currentGame.currentTurn !== playerName) {
            setError("It's not your turn!");
            return;
        }
        socketService.placeTile(currentGame.id, { row, col }, letter);
    };

    const handleEndTurn = () => {
        if (currentGame?.currentTurn === playerName) {
            socketService.endTurn(currentGame.id);
        }
    };

    // Show lobby if not in a game
    if (!currentGame) {
        return (
            <GameContainer>
                <h2>Game Lobby</h2>
                <Button onClick={createGame}>Create New Game</Button>
                
                {error && <StatusMessage style={{ color: 'red' }}>{error}</StatusMessage>}
                
                <GamesList>
                    {Array.isArray(availableGames) && availableGames.length > 0 ? (
                        availableGames.map(game => (
                            <GameItem key={game.id || Math.random()}>
                                <div>
                                    <div>Host: {game.hostName || 'Unknown'}</div>
                                    <div>Players: {game.playerCount || 1}/4</div>
                                </div>
                                <Button
                                    onClick={() => joinGame(game.id)}
                                    disabled={game.playerCount >= 4}
                                >
                                    Join Game
                                </Button>
                            </GameItem>
                        ))
                    ) : (
                        <StatusMessage>No games available. Create one!</StatusMessage>
                    )}
                </GamesList>
            </GameContainer>
        );
    }

    // Show game board if in a game
    const isPlayerTurn = currentGame.currentTurn === playerName;
    const players = currentGame.players || [];

    return (
        <GameContainer>
            <h2>Game Room</h2>
            {error && <StatusMessage style={{ color: 'red' }}>{error}</StatusMessage>}

            <PlayersList>
                {players.map((player) => (
                    <PlayerCard 
                        key={player.id || player.name}
                        isCurrentTurn={player.name === currentGame.currentTurn}
                    >
                        <h3>{player.name}</h3>
                        <div>Score: {player.score || 0}</div>
                    </PlayerCard>
                ))}
            </PlayersList>

            <Board 
                board={currentGame.board || Array(15).fill().map(() => Array(15).fill(null))}
                onPlaceTile={handlePlaceTile}
                isPlayerTurn={isPlayerTurn}
            />
            
            <GameControls 
                onEndTurn={handleEndTurn}
                isPlayerTurn={isPlayerTurn}
                gameStatus={currentGame.status}
            />
            
            <Rack 
                tiles={players.find(p => p.name === playerName)?.rack || []}
                isPlayerTurn={isPlayerTurn}
            />
        </GameContainer>
    );
};

export default GameRoom;
