import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../../context/GameContext';
import { PlayerContext } from '../../context/PlayerContext';
import Board from '../Board';
import Rack from '../Rack';
import GameControls from '../GameControls';
import useSocket from '../../hooks/useSocket';

const GameRoom = () => {
  const { gameState, updateGameState } = useContext(GameContext);
  const { playerState } = useContext(PlayerContext);
  const socket = useSocket();
  const [selectedTile, setSelectedTile] = useState(null);
  const [playedTiles, setPlayedTiles] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('gameUpdate', (updatedGame) => {
      updateGameState(updatedGame);
    });

    return () => {
      socket.off('gameUpdate');
    };
  }, [socket, updateGameState]);

  const handleTileSelect = (tile) => {
    setSelectedTile(tile);
  };

  const handleBoardClick = (position) => {
    if (!selectedTile) return;
    
    setPlayedTiles(prev => [...prev, { ...selectedTile, position }]);
    setSelectedTile(null);
  };

  const handlePlayMove = () => {
    if (!playedTiles.length) return;

    socket.emit('playMove', {
      gameId: gameState?.gameId,
      playerId: playerState?.playerId,
      tiles: playedTiles
    });
    setPlayedTiles([]);
  };

  const handlePass = () => {
    socket.emit('passTurn', {
      gameId: gameState?.gameId,
      playerId: playerState?.playerId
    });
  };

  // Safely access players with null checks
  const currentPlayerTiles = gameState?.players?.find(
    player => player.playerId === playerState?.playerId
  )?.tiles || [];

  const scores = gameState?.players?.map(player => ({
    playerId: player.playerId,
    score: player.score,
    isCurrentPlayer: player.playerId === gameState.currentPlayer
  })) || [];

  if (!gameState) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="game-room">
      <div className="game-info">
        <h2>Game Room: {gameState.gameId}</h2>
        <div className="scores">
          {scores.map((player) => (
            <div 
              key={player.playerId} 
              className={`score ${player.isCurrentPlayer ? 'current-player' : ''}`}
            >
              Player {player.playerId}: {player.score}
              {player.isCurrentPlayer && ' (Current Turn)'}
            </div>
          ))}
        </div>
      </div>

      <Board 
        board={gameState.board || []} 
        playedTiles={playedTiles}
        onCellClick={handleBoardClick}
      />

      <Rack 
        tiles={currentPlayerTiles}
        selectedTile={selectedTile}
        onTileSelect={handleTileSelect}
      />

      <GameControls 
        onPlay={handlePlayMove}
        onPass={handlePass}
        isCurrentPlayer={gameState.currentPlayer === playerState?.playerId}
      />
    </div>
  );
};

export default GameRoom;
