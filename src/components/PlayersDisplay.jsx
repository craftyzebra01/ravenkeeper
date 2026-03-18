import { useState } from "react"
import Player from "./Player"

const PlayersDisplay = ({players, dispatch}) => {
    const [playerName, setPlayerName] = useState('')

    const handleAddPlayer = (e) => {
        e.preventDefault()
        dispatch({type: 'add_player', playerName: playerName})
        setPlayerName('')
    }

    const handleDelPlayer = (e) => {
        dispatch({type: 'del_player', playerName: playerName})
    }

    return (
        <div className='player-info'>
            <ul className='player-list'>
                {players.map((player, index) => (
                    <li key={player.name || index}
                        className='player-row'>
                            <Player
                                name={player.name}
                                roleName={player.role?.name}
                                roleType={player.role?.type}
                            />

                            <div className='player-setup-buttons'>
                                <button> 
                                    X
                                </button>
                                <div className='up-down'>
                                    <button>^</button>
                                    <button>v</button>
                                </div>
                            </div>
                        </li>
                ))}
            </ul>
            
            <form onSubmit={(e) => handleAddPlayer(e)}>
                <input
                    type='text'
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder='Enter player name...'
                    aria-label='Player Name'
                />
                <button type='submit'>
                    Add Player
                </button>
            </form>
        </div>
    )
}

export default PlayersDisplay;