import React, {useState, useEffect, useReducer} from 'react';
import { gameReducer } from './utils/gameLogic'
import { allScripts } from './data/scripts/allScripts'
import Grimoire from './components/Grimoire'
import RoleInfo from './components/RoleInfo';
import ScriptOrder from './components/ScriptOrder';

export default function GameContainer() {
    const [game, dispatch] = useReducer(gameReducer, initialGame);

    const renderGame = (overlay) => {
        switch(overlay) {
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
        <div className='game-container'>
            {renderGame(game.overlay)}
            <div className='menu'>
                <button onClick={() => dispatch({type: 'set_overlay', overlay: 'grimoire'})}>Grimoire</button>
                <button onClick={() => dispatch({type: 'set_overlay', overlay: 'role_info'})}>Roles</button>
                <button onClick={() => dispatch({type: 'set_overlay', overlay: 'script_order'})}>Script Order</button>
            </div>
        </div>
    )

}

const initialGame = {
    phase: 'setup',
    overlay: 'grimoire', // [grimoire,roleInfo,scriptOrder,night(?)]
    players: [],
    script: allScripts[0]
};

