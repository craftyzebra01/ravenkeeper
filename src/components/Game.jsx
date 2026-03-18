import React, {useState, useEffect } from 'react';
import Player from './Player';
import {assignRoles, isBetween, nextPhase} from './../utils/gameHelper';
import RolesDisplay from './RolesDisplay';
import ScriptOrder from './ScriptOrderDisplay';

const Game = () => {
    const testPlayers = Array.from({length:4 }, (_, i) => ({name: i}));
    const [scripts, setScripts] = useState([]);
    const [playerName, setPlayerName] = useState("");
    const [game, setGame] = useState({players: testPlayers, phase: 'setup'});
    const [viewRoles, setViewRoles] = useState(false);
    const [viewScriptOrder, setViewScriptOrder] = useState(false);


    const fetchScripts = async (fileNames) => {
        try{
            const promises = fileNames.map(fileName =>
                fetch(`/scripts/${fileName}`)
                    .then(response => response.json())
                    .catch(error => console.error(`Error fetching: ${fileName}: ${error}`))
            );

            const results = await Promise.all(promises);

            setScripts(results);
            if (!game.script?.roles || !game.script?.name) {
                setGame({
                    ...game,
                    script: results[0]
                })
            }
        } catch (error) {
            console.error("Error batch loading scripts:", error);
        };
    };

    // EVENTS START

    // TODO: Assign roles from 'selectedRoles' or something similar.
    const handleAddPlayer = (e) => {
        e.preventDefault();
        if (playerName) {
            setGame({
                ...game,
                players: [...game.players, {name: playerName}]
            });
            setPlayerName("");
        }
    }

    const handleScriptChange = (scriptName) => {
        // TODO: This should refresh the file from the server?
        setGame({
            ...game,
            script: scripts.find(item => item.name == scriptName)
        })
    };

    const handleRemovePlayer = (playerName) => {
        setGame({...game, players: game.players.filter(player => player.name !== playerName)})
    }

    const handleViewRoles = () => {
        setViewRoles(true);
    }

    const handleViewScriptOrder = () => {
        setViewScriptOrder(true);
    }

    const handleResetGame = () => {
        setGame({
            phase: 'setup',
            script: scripts[0],
            players: []
        })
    }

    const handleShuffleRoles = () => {
        if (isBetween(game.players.length, 5, 15) ){
            setGame({...game, players: assignRoles(game.players, game.script.roles)});
        }
    }

    const handleNextPhase = () => {
        setGame({
            ...game,
            phase: nextPhase[game.phase]
        }); 
    }

    // EVENTS END

    useEffect(() => {
        fetch('/scripts/index.json')
            .then(response => response.json())
            .then(data => fetchScripts(data))
            .catch(error => console.error(error));
    }, []);

    if (viewRoles) {
        return (
            <RolesDisplay
                roles={game.script.roles}
                backFn={() => setViewRoles(false)}
            />
        )
    }
    if (viewScriptOrder) {
        return (
            <ScriptOrder
                firstNight={game.script.firstNight}
                otherNight={game.script.otherNight}
                backFn={() => setViewScriptOrder(false)}
            />
        )
    }
    
    if(game.phase === 'preGame') {
        return (
            <PreGame
                players={game.players}
                backFn={() => setGame({...game, phase: nextPhase[game.phase]})}
            />
        )
    }
    // Probably refactor this to a setup component?
    return (
        <div>
            <h3>{game.phase}</h3>
            <div className='game'>
                <div className='script-info'>
                    <select
                        value={game.script?.name}
                        onChange={(e) => handleScriptChange(e.target.value)}
                    >
                        {scripts.map(script => (
                            <option key={script.name} value={script.name}>
                                {script.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleViewRoles}>Roles</button>
                    <button onClick={handleViewScriptOrder}>Script Order</button>
                </div>
                
                <div className='player-info'>
                    <ul className='player-list'>
                        {game.players.map((player, index) => (
                        <li key={player.name || index}
                            className='player-row'
                        >
                            <Player 
                                name={player.name}
                                roleName={player.role?.name}
                                roleType={player.role?.type}
                            />
                            
                            {game.phase === 'setup' && (
                                <div className='player-setup-buttons'>
                                    <button type="button" onClick={() => handleRemovePlayer(player.name)}>X</button>
                                    <div className='up-down'>
                                        <button>^</button>
                                        <button>v</button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                    </ul>
                    
                    <form onSubmit={(e) => handleAddPlayer(e)}>
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
                </div>

                <div className='util-info'>
                    <button onClick={handleShuffleRoles}>Shuffle Roles</button>
                    <button onClick={handleResetGame}>Reset Game</button>
                    <button onClick={handleNextPhase}>Next Phase</button>
                    <button>End Game</button>
                </div>
            </div>
        </div>
    )
}

export default Game;
