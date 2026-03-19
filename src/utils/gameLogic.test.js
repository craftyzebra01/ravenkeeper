import {assignRoles, gameReducer, initialGame} from './gameLogic'
import {expect, test, describe} from 'vitest';

const samplePlayers = [
    {name: 'aaa'},
    {name: 'bbb'},
    {name: 'ccc'},
    {name: 'ddd'},
    {name: 'eee'}
]

const sampleRoles = [
    {name: 't1', type: 'townsfolk'},
    {name: 't2', type: 'townsfolk'},
    {name: 't3', type: 'townsfolk'},
    {name: 't4', type: 'minion'},
    {name: 't5', type: 'demon'}
]

const samplePlayersWithRoles = assignRoles(samplePlayers, sampleRoles)

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

    test('assign_roles assigns the correct amount or roles for 5 players', () => {
        const game = gameReducer({players: samplePlayers, roles: sampleRoles}, {type: 'assign_roles'})

        expect(game.players).toHaveLength(5)
        expect(game.players.filter(player => player.role.type === 'townsfolk')).toHaveLength(3)
        expect(game.players.filter(player => player.role.type === 'outsider')).toEqual([])
        expect(game.players.filter(player => player.role.type === 'minion')).toHaveLength(1)
        expect(game.players.filter(player => player.role.type === 'demon')).toHaveLength(1)
    })

    test('assign_roles 1 player throws range error', () => {
        expect(() => gameReducer({players: [{name: 'aaa'}], roles: sampleRoles}, {type: 'assign_roles'})).toThrow(RangeError)
    })

    // worth adding tests for nextPhase transition?
    test('next_phase setup -> preGame', () => {
        const game = gameReducer({players: samplePlayers, roles: sampleRoles, phase: 'setup'}, {type: 'next_phase'})

        expect(game.phase).toEqual('preGame')
    })

    test('next_phase setup should create actionQueue', () => {
        const game = gameReducer({players: samplePlayers, roles: sampleRoles, phase: 'setup'}, {'type': 'next_phase'})

        expect(game.actionQueue).toHaveLength(5)
    })

    test('next_phase preGame -> firstNight', () => {
        const game = gameReducer({phase: 'preGame'}, {type: 'next_phase'})

        expect(game.phase).toEqual('firstNight')
    })

    test('next_phase firstNight -> day', () => {
        const game = gameReducer({phase: 'firstNight'}, {type: 'next_phase'})

        expect(game.phase).toEqual('day')
    })
    test('next_phase day -> otherNight', () => {
        const game = gameReducer({phase: 'day'}, {type: 'next_phase'})

        expect(game.phase).toEqual('otherNight')
    })
    test('next_phase otherNight -> day', () => {
        const game = gameReducer({phase: 'otherNight'}, {type: 'next_phase'})

        expect(game.phase).toEqual('day')
    })

    test('reset_game returns initialGame', () => {
        expect(gameReducer({}, {type: 'reset_game'})).toEqual(initialGame)
    })
})