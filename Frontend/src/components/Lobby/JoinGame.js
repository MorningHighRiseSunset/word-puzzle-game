import React, { useState } from 'react';
import styled from 'styled-components';
import { usePlayer } from '../../context/PlayerContext';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    max-width: 400px;
    margin: 2rem auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
    color: #333;
    margin-bottom: 2rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.8rem;
    margin: 0.5rem 0;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
`;

const Button = styled.button`
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: #45a049;
    }
`;

const JoinGame = () => {
    const [name, setName] = useState('');
    const { joinLobby } = usePlayer();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            joinLobby(name.trim());
        }
    };

    return (
        <Container>
            <Title>Word Puzzle Game</Title>
            <form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Button type="submit">Join Game</Button>
            </form>
        </Container>
    );
};

export default JoinGame;
