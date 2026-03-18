import {allScripts} from '../data/scripts/allScripts'

export function gameReducer(game, action) {
    switch (action.type) {
        case 'set_script': {
            return {
                ...game, 
                script: allScripts.find(s => s.name == action.scriptName)
            }
        }
        case 'set_overlay': {
            return {
                ...game,
                overlay: action.overlay
            }
        }
        case 'del_player': {
            return {
                ...game, 
                players: game.players.filter(player => player.name !== action.playerName)
            }
        }
        case 'add_player': {
            return {
                ...game,
                players: [...game.players, {name: action.playerName}]
            }
        }
        default: 
            return game;
    }
}