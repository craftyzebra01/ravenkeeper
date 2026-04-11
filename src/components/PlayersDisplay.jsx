import { useState } from "react"
import Player from "./Player"
import DeathButton from "./DeathButton"
import { roleTypeBg } from "../utils/roleColors"

const PlayerRow = ({player, phase, dispatch, selectedRoles}) => {
    const [tagsOpen, setTagsOpen] = useState(false)
    const [tagInput, setTagInput] = useState('')

    const tags = player.tags ?? []

    const handleAddTag = (e) => {
        e.preventDefault()
        if (!tagInput.trim()) return
        dispatch({type: 'add_tag', playerName: player.name, tag: tagInput.trim()})
        setTagInput('')
    }

    return (
        <li className={`flex flex-col rounded-lg px-4 py-3 ${player.dead ? 'bg-slate-700 opacity-50' : (roleTypeBg[player.role?.team] ?? 'bg-slate-800')}`}>
            <div className='flex items-center justify-between'>
                <Player
                    name={player.name}
                    roleName={player.role?.name}
                    roleType={player.role?.team}
                />
                <div className='flex items-center gap-2'>
                {phase === 'setup' && selectedRoles?.length > 0 && (
                    <select
                        value={player.assignedRole?.name ?? ''}
                        onChange={e => dispatch({
                            type: 'set_player_role',
                            playerName: player.name,
                            role: selectedRoles.find(r => r.name === e.target.value) ?? null
                        })}
                        className='bg-slate-700 text-slate-200 text-xs rounded px-2 py-1 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    >
                        <option value=''>Random</option>
                        {selectedRoles.map(r => (
                            <option key={r.name} value={r.name}>{r.name}</option>
                        ))}
                    </select>
                )}
                    <button
                        onClick={() => setTagsOpen(o => !o)}
                        className='px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 text-xs transition-colors'>
                        {tags.length > 0 ? `Tags ${tags.length}` : 'Tags'}
                    </button>
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
                    {phase === 'setup' && (
                        <div className='flex flex-col gap-0.5'>
                            <button onClick={() => dispatch({type: 'move_player', playerName: player.name, direction: 'up'})} className='w-7 h-5 flex items-center justify-center rounded bg-slate-700 text-slate-400 hover:bg-slate-600 text-xs transition-colors'>^</button>
                            <button onClick={() => dispatch({type: 'move_player', playerName: player.name, direction: 'down'})} className='w-7 h-5 flex items-center justify-center rounded bg-slate-700 text-slate-400 hover:bg-slate-600 text-xs transition-colors'>v</button>
                        </div>
                    )}
                </div>
            </div>
            {tagsOpen && (
                <div className='mt-2 flex flex-col gap-2'>
                    {tags.length > 0 && (
                        <div className='flex flex-wrap gap-1'>
                            {tags.map((tag, i) => (
                                <span key={i} className='flex items-center gap-1 bg-slate-600 text-white text-xs rounded-full px-2 py-0.5'>
                                    {tag}
                                    <button
                                        onClick={() => dispatch({type: 'remove_tag', playerName: player.name, index: i})}
                                        className='text-slate-400 hover:text-white transition-colors leading-none'>
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                    <form onSubmit={handleAddTag} className='flex gap-2'>
                        <input
                            type='text'
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder='Add tag...'
                            className='flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        />
                        <button type='submit' className='px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors'>
                            Add
                        </button>
                    </form>
                </div>
            )}
        </li>
    )
}

const PlayersDisplay = ({players, phase, dispatch, selectedRoles}) => {
    const [playerName, setPlayerName] = useState('')

    const handleAddPlayer = (e) => {
        e.preventDefault()
        dispatch({type: 'add_player', playerName: playerName})
        setPlayerName('')
    }

    return (
        <div className='flex flex-col gap-3'>
            <ul className='flex flex-col gap-2'>
                {players.map((player, index) => (
                    <PlayerRow
                        key={player.name || index}
                        player={player}
                        phase={phase}
                        dispatch={dispatch}
                        selectedRoles={selectedRoles}
                    />
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
