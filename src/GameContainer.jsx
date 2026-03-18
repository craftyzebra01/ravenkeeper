import React, {useState, useEffect, useReducer} from 'react';
import { gameReducer } from './utils/gameLogic'
import { allScripts } from './data/scripts/allScripts'
import Setup from './phases/Setup' 

export default function GameContainer() {
    const [game, dispatch] = useReducer(gameReducer, initialGame);

    const renderPhase = (phase) => {
        switch(phase) {
            case 'setup':
                return (
                    <div>
                        <Setup
                            scriptNames={allScripts.map(s => s.name)}
                            selectedScript={game.script}
                            dispatch={dispatch}
                        />
                    </div>
                );
            default:
                return (
                    <div>
                        you should not be here!
                    </div>
                );
        }
    }

    return (
        <div className='game-container'>
            {renderPhase(game.phase)}
        </div>
    )

}

const initialGame = {
    phase: 'setup',
    players: [],
    script: allScripts[0]
};

