import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePlayer } from '../../context/PlayerContext';
import socketService from '../../services/socketService';

const Container = styled.div`
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
`;

const PlayerList = styled.div`
    margin: 20px 0;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 8px;
`;

const PlayerCard = styled.div`
    margin: 10px;
    padding: 10px;
    background: ${props => props.isOnline ? '#e8f5e9' : '#ffebee'};
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Button = styled.button`
    padding: 10px 20px;
    margin: 5px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const Message = styled.div`
    padding: 10px;
    margin: 10px 0;
    background: #e3f2fd;
    border-radius: 4px;
`;

const GameRoom = () => {
    const { playerName } = usePlayer();
    const [connectedPlayers, setConnectedPlayers] = useState({});
    const [lastPing, setLastPing] = useState({});
    const [gameMessage, setGameMessage] = useState('');

    useEffect(() => {
        const socket = socketService.connect();

        // When joining, announce yourself
        socket.emit('playerJoined', { playerName });

        // Listen for other players
        socket.on('playersList', (players) => {
            setConnectedPlayers(players);
        });

        // Listen for pings from other players
        socket.on('pingReceived', ({ from, message }) => {
            setLastPing(prev => ({
                ...prev,
                [from]: message
            }));
            // Clear ping message after 3 seconds
            setTimeout(() => {
                setLastPing(prev => ({
                    ...prev,
                    [from]: ''
                }));
            }, 3000);
        });

        // Listen for game messages
        socket.on('gameMessage', (message) => {
            setGameMessage(message);
            setTimeout(() => setGameMessage(''), 3000);
        });

        return () => {
            socket.emit('playerLeft', { playerName });
            socket.disconnect();
        };
    }, [playerName]);

    const sendPing = () => {
        socketService.emit('sendPing', {
            from: playerName,
            message: `👋 Ping from ${playerName}!`
        });
    };

    return (
        <Container>
            <h2>Multiplayer Test Room</h2>
            
            {gameMessage && (
                <Message>{gameMessage}</Message>
            )}

            <PlayerList>
                <h3>Connected Players:</h3>
                {Object.entries(connectedPlayers).map(([name, status]) => (
                    <PlayerCard key={name} isOnline={status.online}>
                        <span>{name} {status.online ? '🟢' : '⚫'}</span>
                        {lastPing[name] && (
                            <span>{lastPing[name]}</span>
                        )}
                        {name !== playerName && status.online && (
                            <Button onClick={sendPing}>
                                Ping {name}
                            </Button>
                        )}
                    </PlayerCard>
                ))}
            </PlayerList>

            <div>
                <p>Your name: {playerName}</p>
                <p>Status: Connected 🟢</p>
            </div>
        </Container>
    );
};

export default GameRoom;
