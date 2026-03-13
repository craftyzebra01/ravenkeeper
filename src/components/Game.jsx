import React, {useState, useEffect } from 'react';

const Game = () => {
    const [scripts, setScripts] = useState([]);
    const [selectedScript, setSelectedScript] = useState("Trouble Brewing");
    const [players, setPlayers] = useState([]);
    const [playerName, setPlayerName] = useState("");

    const fetchScripts = async (fileNames) => {
        try{
            const promises = fileNames.map(fileName =>
                fetch(`/scripts/${fileName}`)
                    .then(response => response.json())
                    // .then(data => console.log(data))
                    .catch(error => console.error(`Error fetching: ${fileName}: ${error}`))
            );

            const results = await Promise.all(promises);

            setScripts(results);
        } catch (error) {
            console.error("Error batch loading scripts:", error);
        };
    };

    const handleAddPlayer = (e) => {
        e.preventDefault();
        if (playerName) {
            setPlayers([...players, {name: playerName}])
            setPlayerName("")
        }
    }

    useEffect(() => {
        fetch('/scripts/index.json')
            .then(response => response.json())
            .then(data => fetchScripts(data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <select
                value={selectedScript}
                onChange={(e) => setSelectedScript(e.target.value)}    
            >
                {scripts.map(script => (
                    <option key={script.name} value={script.name}>
                        {script.name}
                    </option>
                ))}
            </select>
            
            <ul>
                {players.map(player => (
                    <li key={player.name}>{player.name}</li>
                ))}
            </ul>
            
            <form onSubmit={handleAddPlayer}>
                <input 
                    type='text'
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder='Enter player name...'
                    aria-label='Player name'
                />
                <button type="submit">
                    Add Player
                </button>
            </form>

            <button type="button" onClick={() => 1} disabled={players.length < 5}>
                Start Game
            </button>
        </div>
    )
}

export default Game;