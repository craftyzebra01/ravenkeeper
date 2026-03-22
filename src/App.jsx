import React, {useState, useEffect, useReducer} from 'react';
import { gameReducer, initialGame } from './utils/gameLogic'
import { allScripts } from './data/scripts/allScripts'
import Grimoire from './components/Grimoire'
import RoleInfo from './components/RoleInfo';
import ScriptOrder from './components/ScriptOrder';
import Night from './components/Night'

export default function App() {
    const [game, dispatch] = useReducer(gameReducer, initialGame);

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
                    if (game.actionQueue.length === 0) {
                        return (
                            <button onClick={() => dispatch({type: 'next_phase'})}
                            >
                                Placeholder Transition Button Text
                            </button>
                        )
                    }
                    return (
                        <Night 
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
        <div className='min-h-screen bg-slate-950 p-6 flex flex-col items-center text-white'>
            <div className='w-full max-w-md'>
                <h2>Phase - {game.phase}</h2>
                <h3>Overlay - {game.overlay}</h3>
                {renderGame()}
                <div className='menu'>
                    <button onClick={() => dispatch({type: 'set_overlay', overlay: 'grimoire'})}>Grimoire</button>
                    <button onClick={() => dispatch({type: 'set_overlay', overlay: 'role_info'})}>Roles</button>
                    <button onClick={() => dispatch({type: 'set_overlay', overlay: 'script_order'})}>Script Order</button>
                </div>
            </div>
        </div>
    )

}


