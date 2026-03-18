import {allScripts} from '../data/scripts/allScripts'

export function gameReducer(game, action) {
    switch (action.type) {
        case 'set_script': {
            return {
                ...game, 
                script: allScripts.find(s => s.name == action.scriptName)
            }
        }
        default: 
            return game;
    }
}