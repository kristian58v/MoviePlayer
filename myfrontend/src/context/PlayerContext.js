// context/PlayerContext.js
import React, { createContext, useContext, useState } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [player, setPlayer] = useState("Player 1");

    const togglePlayer = () => {
        setPlayer(player === "Player 1" ? "Player 2" : "Player 1");
    };

    return (
        <PlayerContext.Provider value={{ player, togglePlayer }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);
