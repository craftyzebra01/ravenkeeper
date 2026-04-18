import { useState } from 'react';
import { roleTypeBg } from '../utils/roleColors';

const ROLE_TYPES = ['townsfolk', 'outsider', 'minion', 'demon']

const BluffPicker = ({ bluffs, bluffPool, bluffsConfirmed, dispatch }) => {
    return (
        <div className='w-full flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
                <span className='text-xs text-slate-400 font-medium uppercase tracking-wide'>
                    {bluffsConfirmed ? 'Confirmed Bluffs' : `Bluffs (${bluffs.length}/3)`}
                </span>
                <div className='flex flex-col gap-1 min-h-10'>
                    {bluffs.length === 0 && (
                        <p className='text-sm text-slate-500 italic'>No bluffs selected</p>
                    )}
                    {bluffs.map(r => (
                        <button
                            key={r.name}
                            onClick={() => !bluffsConfirmed && dispatch({ type: 'toggle_bluff', role: r })}
                            className={`flex items-start justify-between rounded-lg px-4 py-2 text-left ${roleTypeBg[r.team]} text-white ${bluffsConfirmed ? 'cursor-default' : ''}`}
                        >
                            <div className='flex flex-col gap-0.5'>
                                <span className='text-sm font-medium'>{r.name}</span>
                                <span className='text-xs text-white/70'>{r.ability}</span>
                            </div>
                            {!bluffsConfirmed && <span className='text-white/70 text-sm ml-2 shrink-0'>✕</span>}
                        </button>
                    ))}
                </div>
            </div>

            {!bluffsConfirmed && (
                <>
                    <button
                        onClick={() => bluffs.length > 0 && dispatch({ type: 'confirm_bluffs' })}
                        className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-colors ${bluffs.length > 0 ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                    >
                        Confirm Bluffs
                    </button>

                    <div className='flex flex-col gap-3'>
                        <span className='text-xs text-slate-400 font-medium uppercase tracking-wide'>Available</span>
                        {ROLE_TYPES.map(team => {
                            const inPool = bluffPool.filter(r => r.team === team)
                            if (!inPool.length) return null
                            return (
                                <div key={team} className='flex flex-col gap-1'>
                                    <span className='text-xs text-slate-500 uppercase tracking-wide'>{team}</span>
                                    {inPool.map(r => {
                                        const selected = bluffs.some(b => b.name === r.name)
                                        const maxed = bluffs.length >= 3 && !selected
                                        return (
                                            <button
                                                key={r.name}
                                                onClick={() => !maxed && dispatch({ type: 'toggle_bluff', role: r })}
                                                className={`flex items-start justify-between rounded-lg px-4 py-2 text-left transition-opacity ${roleTypeBg[r.team]} text-white ${maxed ? 'opacity-25 cursor-not-allowed' : selected ? 'opacity-100' : 'opacity-40 hover:opacity-60'}`}
                                            >
                                                <div className='flex flex-col gap-0.5'>
                                                    <span className='text-sm font-medium'>{r.name}</span>
                                                    <span className='text-xs text-white/70'>{r.ability}</span>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}

const Night = ({phase, action, dispatch, bluffs, bluffPool, bluffsConfirmed}) => {
    const [revealed, setRevealed] = useState(false);

    const handleNextClick = () => {
        setRevealed(false);
        dispatch({type: 'next_action'});
    }

    if (!action) {
        return (
            <div className='flex flex-col items-center gap-4 bg-slate-800 rounded-xl p-8 text-center'>
                <p className='text-slate-400'>No more actions.</p>
            </div>
        )
    }

    const hiddenBg = action.role?.team ? roleTypeBg[action.role.team] : 'bg-slate-700';
    const isDemonInfo = action.name === 'Demon Info'

    return (
        <div className='flex flex-col items-center gap-6 bg-slate-800 rounded-xl p-8 text-center'>
            {action.playerName && (
                <p className='text-3xl font-bold text-white'>{action.playerName}</p>
            )}
            {action.name && !action.playerName && (
                <p className='text-xl font-semibold text-white/70'>{action.name}</p>
            )}
            <div className={`text-white text-lg w-full rounded-lg px-4 py-3 ${phase !== 'preGame' ? hiddenBg : '' }`}>
                {action.visibleMessage}
            </div>

            {isDemonInfo && (
                <BluffPicker
                    bluffs={bluffs ?? []}
                    bluffPool={bluffPool ?? []}
                    bluffsConfirmed={bluffsConfirmed}
                    dispatch={dispatch}
                />
            )}

            {action.hiddenMessage && (
                <div className='w-full flex flex-col items-center gap-3'>
                    {revealed ? (
                        <div className={`w-full rounded-lg px-4 py-3 text-white text-sm ${hiddenBg}`}>
                            {action.hiddenMessage}
                        </div>
                    ) : (
                        <button
                            onClick={() => setRevealed(true)}
                            className='px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors'
                        >
                            Reveal
                        </button>
                    )}
                </div>
            )}

            <button
                onClick={handleNextClick}
                className='px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors'
            >
                Next
            </button>
        </div>
    )
}

export default Night;
