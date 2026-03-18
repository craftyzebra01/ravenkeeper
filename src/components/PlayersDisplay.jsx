import Player from "./Player"

const PlayersDisplay = ({players, dispatch}) => {
 
    return (
        <div className='player-info'>
            <ul className='player-list'>
                {players.map((player, index) => {
                    <li key={player.name || index}
                        className='player-row'>
                            <Player
                                name={player.name}
                                roleName={player.role?.name}
                                roleType={player.role?.type}
                            />

                            <div className='player-setup-buttons'>
                                <button onClick={() => dispatch({type: 'del_player', playerName: player.name})}>
                                    X
                                </button>
                                <div className='up-down'>
                                    <button>^</button>
                                    <button>v</button>
                                </div>
                            </div>
                        </li>
                })}
            </ul>

            <form onSubmit={(e) => dispatch({type: 'add_player', playerName: e.target.value})}>
                <input
                    type='text'
                    placeholder='Enter player name...'
                    aria-label='Player name'
                />
                <button type='submit'>
                    Add Player
                </button>
            </form>
        </div>
    )
}

export default PlayersDisplay;