import {gameReducer} from './gameLogic'
import {expect, test, describe} from 'vitest';

describe('gameLogic', () => {
    test('set_script updates script', () => {
        const scriptName = 'Bad Moon Rising'
        const game = gameReducer({}, {
            type: 'set_script',
            scriptName: scriptName 
        })

        expect(game.script.name === scriptName).toBeTruthy()
    })

    test('set_overlay', () => {
        const overlay ='grimoire'
        const game = gameReducer({}, {
            type: 'set_overlay',
            overlay: overlay
        })
        expect(game.overlay === overlay).toBeTruthy()
    })

    test('del_player removes player by name', () => {
        const game = gameReducer({players: [{name: 'aaa'}, {name: 'bbb'}]}, {type: 'del_player', playerName: 'aaa'})
        expect(game.players.find(player => player.name === 'aaa')).toBeUndefined()
        expect(game.players.find(player => player.name === 'bbb')).toBeTruthy()
        expect(game.players).toEqual([{name: 'bbb'}])
        expect(game.players).toHaveLength(1)
    })

    test('add_player adds player by name', () => {
        const game = gameReducer({players: [{name: 'aaa'}]}, {type: 'add_player', playerName: 'bbb'})
        expect(game.players).toEqual([{name: 'aaa'}, {name: 'bbb'}])
        expect(game.players).toHaveLength(2)
    })
})