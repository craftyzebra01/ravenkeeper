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
})