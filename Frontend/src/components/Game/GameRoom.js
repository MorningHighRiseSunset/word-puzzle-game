import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePlayer } from '../../context/PlayerContext';
import Board from '../Board';
import Rack from '../Rack';
import GameControls from '../GameControls';
import socketService from '../../services/socketService';

const Container = styled.div`
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

const GameRoom = () => {
    const { playerName } = usePlayer();
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
        });

        socket.on('gameError', (errorMessage) => {
            setError(errorMessage);
        });

        // Request initial games list
        socket.emit('getGames');

        return () => socket.disconnect();
    }, []);

    const createGame = () => {
        socketService.emit('createGame', { playerName });
    };

    const joinGame = (gameId) => {
        socketService.emit('joinGame', { gameId, playerName });
    };

    const handlePlaceTile = (row, col, letter) => {
        if (currentGame?.currentTurn !== playerName) {
            setError("It's not your turn!");
            return;
        }
        socketService.emit('placeTile', {
            gameId: currentGame.id,
            playerName,
            position: { row, col },
            letter
        });
    };

    const handleEndTurn = () => {
        if (currentGame?.currentTurn === playerName) {
            socketService.emit('endTurn', { 
                gameId: currentGame.id, 
                playerName 
            });
        }
    };

    // Show lobby if not in a game
    if (!currentGame) {
        return (
            <Container>
                <h2>Game Lobby</h2>
                <Button onClick={createGame}>Create New Game</Button>
                
                <GamesList>
                    {availableGames.map(game => (
                        <GameItem key={game.id}>
                            <div>
                                <div>Host: {game.players[0]}</div>
                                <div>Players: {game.players.length}/4</div>
                            </div>
                            <Button
                                onClick={() => joinGame(game.id)}
                                disabled={game.players.length >= 4}
                            >
                                Join Game
                            </Button>
                        </GameItem>
                    ))}
                    {availableGames.length === 0 && (
                        <div>No games available. Create one!</div>
                    )}
                </GamesList>
            </Container>
        );
    }

    // Show game board if in a game
    const isPlayerTurn = currentGame.currentTurn === playerName;

    return (
        <Container>
            <h2>Game Room</h2>
            {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
            )}

            <PlayersList>
                {currentGame.players.map((player) => (
                    <PlayerCard 
                        key={player.name}
                        isCurrentTurn={player.name === currentGame.currentTurn}
                    >
                        <h3>{player.name}</h3>
                        <div>Score: {player.score}</div>
                    </PlayerCard>
                ))}
            </PlayersList>

            <Board 
                board={currentGame.board}
                onPlaceTile={handlePlaceTile}
                isPlayerTurn={isPlayerTurn}
            />
            
            <GameControls 
                onEndTurn={handleEndTurn}
                isPlayerTurn={isPlayerTurn}
                gameStatus={currentGame.status}
            />
            
            <Rack 
                tiles={currentGame.players.find(p => p.name === playerName)?.rack || []}
                isPlayerTurn={isPlayerTurn}
            />
        </Container>
    );
};

export default GameRoom;
