import React, {useState, useEffect } from 'react';
import Player from './Player'

const Game = () => {
    const testPlayers = Array.from({length:5}, (_, i) => ({name: i}));
    const [scripts, setScripts] = useState([]);
    const [playerName, setPlayerName] = useState("");
    const [game, setGame] = useState({selectedScript: "Trouble Brewing", players: testPlayers});

    // access math = playercount - 5 (5-5=>0, 6-5=>1)
    const roleCounts = [
        [3, 0, 1, 1], // what is the pattern here?
        [3, 1, 1, 1],
        [5, 0, 1, 1],
        [5, 1, 1, 1],
        [5, 2, 1, 1],
        [7, 0, 2, 1],
        [7, 1, 2, 1],
        [7, 2, 2, 1],
        [9, 0, 3, 1],
        [9, 1, 3, 1],
        [9, 2, 3, 1]
    ]

    const roleIndex = ["townsfolk", "outsiders", "minions", "demons"];

    const fetchScripts = async (fileNames) => {
        try{
            const promises = fileNames.map(fileName =>
                fetch(`/scripts/${fileName}`)
                    .then(response => response.json())
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
            //setPlayers([...players, {name: playerName}])
            setGame({...game, players: [...game.players, {name: playerName}]})
            setPlayerName("")
        }
    }

    const handleRemovePlayer = (playerName) => {
        setGame({...game, players: game.players.filter(player => player.name !== playerName)})
    }

    const shuffleArray = (arr) => {
        if (!arr) {return []};
        const clone = structuredClone(arr);
        
        for(let i = clone.length - 1; i >= 0; i--) {
            let j = Math.floor(Math.random() * (i+1));
            [clone[i], clone[j]] = [clone[j], clone[i]];
        }

        return clone;
    }
    
    const handleAssignRoles = () => {
        const scriptData = scripts.find(item => item.name == game.selectedScript);
        const roles = scriptData.roles;
        const currentRoleCounts = roleCounts[game.players.length - 5]
        const firstThreeRoles = currentRoleCounts.map((c, index) => {
            return shuffleArray(roles[roleIndex[index]]).slice(0, c);
        }).flat();

        console.log(firstThreeRoles);
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
                value={game.selectedScript}
                onChange={(e) => setGame({...game, selectedScript: e.target.value})}
            >
                {scripts.map(script => (
                    <option key={script.name} value={script.name}>
                        {script.name}
                    </option>
                ))}
            </select>
            
            {game.players.map((a, b) => (
                <div key={a.name || b}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Player 
                        name={a.name}
                        role={a.role}
                    />
                    <button type="button" onClick={() => handleRemovePlayer(a.name)}>X</button>
                </div>
            ))}
            
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

            <button type="button" onClick={() => handleAssignRoles()} disabled={game.players.length < 5}>
                Assign Roles
            </button>
        </div>
    )
}

export default Game;
