import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePlayer } from '../../context/PlayerContext';
import socketService from '../../services/socketService';

const Container = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
`;

const PlayerList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 20px 0;
`;

const PlayerCard = styled.div`
    padding: 20px;
    background: ${props => props.isActive ? '#e8f5e9' : '#fff'};
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
    }
`;

const ButtonGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 10px;
`;

const ActionButton = styled.button`
    padding: 10px;
    background: ${props => props.color || '#4CAF50'};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s ease;

    &:hover {
        opacity: 0.9;
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }
`;

const ActionLog = styled.div`
    margin-top: 10px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 8px;
    max-height: 100px;
    overflow-y: auto;
    text-align: left;
`;

const StatusBadge = styled.span`
    padding: 4px 8px;
    border-radius: 12px;
    background: ${props => props.online ? '#4CAF50' : '#ff5722'};
    color: white;
    font-size: 0.8em;
    margin-left: 8px;
`;

const GameRoom = () => {
    const { playerName } = usePlayer();
    const [players, setPlayers] = useState({});
    const [actions, setActions] = useState([]);
    const [buttonStates, setButtonStates] = useState({});

    useEffect(() => {
        const socket = socketService.connect();

        // Join room
        socket.emit('playerJoined', { playerName });

        // Listen for updated player list
        socket.on('playersList', (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        // Listen for player actions
        socket.on('playerAction', ({ player, action, buttonId }) => {
            // Update action log
            setActions(prev => [{
                player,
                action,
                time: new Date().toLocaleTimeString()
            }, ...prev].slice(0, 10));

            // Update button states
            if (buttonId) {
                setButtonStates(prev => ({
                    ...prev,
                    [`${player}-${buttonId}`]: true
                }));
                // Reset button state after animation
                setTimeout(() => {
                    setButtonStates(prev => ({
                        ...prev,
                        [`${player}-${buttonId}`]: false
                    }));
                }, 200);
            }
        });

        return () => {
            socket.emit('playerLeft', { playerName });
            socket.disconnect();
        };
    }, [playerName]);

    const sendAction = (actionType, buttonId) => {
        socketService.emit('playerAction', {
            player: playerName,
            action: actionType,
            buttonId
        });
    };

    const ActionButton = ({ id, color, text }) => (
        <button
            style={{
                padding: '10px',
                background: color,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transform: buttonStates[`${playerName}-${id}`] ? 'scale(0.95)' : 'scale(1)',
                transition: 'transform 0.2s'
            }}
            onClick={() => sendAction(text, id)}
        >
            {text}
        </button>
    );

    return (
        <Container>
            <h2>Real-Time Multiplayer Test</h2>
            
            <PlayerList>
                {Object.entries(players).map(([name, data]) => (
                    <PlayerCard key={name} isActive={data.online}>
                        <h3>
                            {name}
                            <StatusBadge online={data.online}>
                                {data.online ? 'Online' : 'Offline'}
                            </StatusBadge>
                        </h3>
                        
                        {name === playerName && (
                            <ButtonGrid>
                                <ActionButton id="1" color="#4CAF50" text="Wave 👋" />
                                <ActionButton id="2" color="#2196F3" text="Jump 🦘" />
                                <ActionButton id="3" color="#9C27B0" text="Dance 💃" />
                                <ActionButton id="4" color="#FF9800" text="Spin 🌀" />
                            </ButtonGrid>
                        )}
                    </PlayerCard>
                ))}
            </PlayerList>

            <ActionLog>
                {actions.map((action, index) => (
                    <div key={index}>
                        [{action.time}] {action.player} did: {action.action}
                    </div>
                ))}
            </ActionLog>
        </Container>
    );
};

export default GameRoom;
