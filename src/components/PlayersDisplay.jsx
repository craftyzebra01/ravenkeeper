import { useState } from "react"
import Player from "./Player"
import DeathButton from "./DeathButton"
import { roleTypeBg } from "../utils/roleColors"

const PlayersDisplay = ({players, phase, dispatch}) => {
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
        <div className='flex flex-col gap-3'>
            <ul className='flex flex-col gap-2'>
                {players.map((player, index) => (
                    <li key={player.name || index}
                        className={`flex items-center justify-between rounded-lg px-4 py-3 ${player.dead ? 'bg-slate-700 opacity-50' : (roleTypeBg[player.role?.type] ?? 'bg-slate-800')}`}>
                            <Player
                                name={player.name}
                                roleName={player.role?.name}
                                roleType={player.role?.type}
                            />
                            <div className='flex items-center gap-2'>
                                <DeathButton
                                    playerName={player.name}
                                    dead={player.dead}
                                    deadVoteUsed={player.deadVoteUsed}
                                    dispatch={dispatch}
                                />
                                {phase === 'setup' && (
                                    <button
                                        onClick={() => dispatch({type: 'del_player', playerName: player.name})}
                                        className='w-7 h-7 flex items-center justify-center rounded bg-slate-700 text-slate-400 hover:bg-slate-600 text-xs transition-colors'>
                                        X
                                    </button>
                                )}
                                <div className='flex flex-col gap-0.5'>
                                    <button className='w-7 h-5 flex items-center justify-center rounded bg-slate-700 text-slate-400 hover:bg-slate-600 text-xs transition-colors'>^</button>
                                    <button className='w-7 h-5 flex items-center justify-center rounded bg-slate-700 text-slate-400 hover:bg-slate-600 text-xs transition-colors'>v</button>
                                </div>
                            </div>
                        </li>
                ))}
            </ul>

            <form onSubmit={(e) => handleAddPlayer(e)} className='flex gap-2'>
                <input
                    type='text'
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder='Enter player name...'
                    aria-label='Player Name'
                    className='flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                />
                <button type='submit' className='px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors'>
                    Add
                </button>
            </form>
        </div>
    )
}

export default PlayersDisplay;