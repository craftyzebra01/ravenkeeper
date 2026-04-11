import { useState } from 'react';
import PlayersDisplay from "./PlayersDisplay";
import ScriptDisplay from "./ScriptDisplay"
import NextPhaseButton from "./NextPhaseButton";
import RoleSelection from "./RoleSelection";

const Grimoire = ({game, dispatch}) => {
    const [view, setView] = useState('players');

    return (
        <div className='flex flex-col gap-4'>
            {game.phase === 'setup' && (
                <ScriptDisplay
                    selectedScript={game.script}
                    dispatch={dispatch}
                />
            )}
            {game.phase === 'setup' && (
                <div className='flex gap-2'>
                    <button
                        onClick={() => setView('players')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'players' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        Players
                    </button>
                    <button
                        onClick={() => setView('role_selection')}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'role_selection' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        Roles
                    </button>
                </div>
            )}
            {view === 'players' ? (
                <PlayersDisplay
                    players={game.players}
                    phase={game.phase}
                    dispatch={dispatch}
                    selectedRoles={game.selectedRoles ?? []}
                />
            ) : (
                <RoleSelection
                    roles={game.roles}
                    selectedRoles={game.selectedRoles ?? []}
                    dispatch={dispatch}
                />
            )}
            <div className='flex gap-2'>
                <NextPhaseButton
                    phase={game.phase}
                    dispatch={dispatch}
                    playerCount={game.players.length}
                    selectedRoles={game.selectedRoles ?? []}
                />
                <button className='px-4 py-2 rounded-lg text-sm bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors' onClick={() => dispatch({type: 'reset_game'})}>Reset</button>
            </div>
        </div>
    )
}

export default Grimoire;
