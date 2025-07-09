import React, {createContext, useContext, useState} from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({children}) => {
    const [currentSong, setCurrentSong] = useState(null);
    return (
        <PlayerContext.Provider value={{currentSong, setCurrentSong}}>
            {children}
        </PlayerContext.Provider>
    )
}
