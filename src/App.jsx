import React, {useState, useEffect, useReducer} from 'react';
import { gameReducer, initialGame } from './utils/gameLogic'
import Grimoire from './components/Grimoire'
import RoleInfo from './components/RoleInfo';
import ScriptOrder from './components/ScriptOrder';
import Night from './components/Night'
import RoleSelection from './components/RoleSelection';

const STORAGE_KEY = 'ravenkeeper_game';

function loadGame() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return initialGame;
        const game = JSON.parse(saved);
        const scriptName = game.script?.name ?? initialGame.script.name;
        return gameReducer(game, {type: 'set_script', scriptName});
    } catch {
        return initialGame;
    }
}

export default function App() {
    const [game, dispatch] = useReducer(gameReducer, undefined, loadGame);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
    }, [game]);

    // the add player input and buttons could go in to 
    // the main display instead of the grimoire itself.
    const renderGame = () => {
        if(game.overlay === 'main') {
            switch(game.phase) {
                case 'setup':
                case 'day':
                    return (
                        <Grimoire
                            game={game}
                            dispatch={dispatch}
                        />
                    )
                case 'preGame':
                case 'firstNight':
                case 'otherNight':
                    return (
                        <Night
                            phase={game.phase}
                            action={game.actionQueue[0]}
                            dispatch={dispatch}
                        />
                    )
            }
        }
        switch(game.overlay) {
            case 'grimoire':
                return (
                    <div>
                        <Grimoire
                            game={game}
                            dispatch={dispatch}
                        />
                    </div>
                )
            case 'role_selection':
                return (
                    <div>
                        <RoleSelection
                            roles={game.roles}
                            selectedRoles={game.selectedRoles}
                            dispatch={dispatch}
                        />
                    </div>
                )
            case 'role_info':
                return (
                    <div>
                        <RoleInfo
                            roles={game.script.roles}
                        />
                    </div>
                )
            case 'script_order':
                return (
                    <div>
                        <ScriptOrder
                            firstNight={game.script.firstNight}
                            otherNight={game.script.otherNight}
                            roles={game.script.roles}
                        />
                    </div>
                )
            default:
                return (
                    <div>
                        How did you get here?
                    </div>
                )
        }
    }

    return (
        <div className='h-screen bg-slate-950 text-white flex flex-col items-center p-6'>
            <div className='w-full max-w-2xl flex flex-col gap-4 h-full'>
                <h1 className='text-center text-lg font-semibold text-slate-300 tracking-wide'>
                    {{ setup: 'Setup', preGame: 'Pre-Game', firstNight: 'First Night', day: 'Day', otherNight: 'Night' }[game.phase]}
                </h1>
                <div className='flex-1 overflow-y-auto'>
                    {renderGame()}
                </div>
                <div className='flex gap-2'>
                    <button className='flex-1 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors' onClick={() => dispatch({type: 'set_overlay', overlay: 'grimoire'})}>Grimoire</button>
                    <button className='flex-1 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors' onClick={() => dispatch({type: 'set_overlay', overlay: 'role_info'})}>Roles</button>
                    <button className='flex-1 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors' onClick={() => dispatch({type: 'set_overlay', overlay: 'script_order'})}>Script Order</button>
                </div>
            </div>
        </div>
    )

}


