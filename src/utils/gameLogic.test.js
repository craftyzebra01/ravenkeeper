import { allScripts } from '../data/scripts/allScripts';
import {assignRoles, gameReducer, initialGame} from './gameLogic'
import {expect, test, describe} from 'vitest';

const samplePlayers = [
    {name: 'aaa', dead: true},
    {name: 'bbb', dead: true},
    {name: 'ccc', dead: true},
    {name: 'ddd', dead: false},
    {name: 'eee', dead: false, deadVoteUsed: true}
]

const sampleDeadVotePlayers = [
    ...samplePlayers,
    {name: 'fff', dead: true, deadVoteUsed: false}
]

const sampleRoles = [
    {name: 't1', type: 'townsfolk'},
    {name: 't2', type: 'townsfolk'},
    {name: 't3', type: 'townsfolk'},
    {name: 't4', type: 'minion'},
    {name: 't5', type: 'demon'}
]

const sampleScript = {
    name: 'Test Script',
    roles: sampleRoles,
    firstNight: ['Dusk', 'Minion Info', 'Demon Info', 't2', 't4', 'Dawn'],
    otherNight: []
}

const sampleGame = {
    phase: 'setup',
    overlay: 'main',
    players: samplePlayers.map( (p, index) => {
        return {
            ...p,
            role: sampleRoles[index]
        }
    }),
    script: sampleScript,
    roles: sampleRoles
}

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
        const game = gameReducer({players: [{name: 'aaa', dead: true}]}, {type: 'add_player', playerName: 'bbb'})
        expect(game.players).toEqual([{name: 'aaa', dead: true}, {name: 'bbb', dead: false}])
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
        const game = gameReducer({...sampleGame, phase: 'preGame'}, {type: 'next_phase'})

        expect(game.phase).toEqual('firstNight')
    })

    // how do I test this has created actions properly?
    // adjust to include names, visibleMessage, hiddenMessage
    test('next_phase preGame -> firstNight actionQueue', () => {
        const game = gameReducer({...sampleGame, phase: 'preGame'}, {type: 'next_phase'})
        expect(game.actionQueue[0].name).toEqual('Dusk')
        expect(game.actionQueue[1].name).toEqual('Minion Info')
        expect(game.actionQueue[2] === 'Demon Info')
        expect(game.actionQueue[4] === 'Dawn')
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

    test('next_action removes the first action', () => {
        const game = gameReducer({actionQueue: [0,1,2]}, {type: 'next_action'})
        expect(game.actionQueue).toEqual([1,2,])
    })

    test('next_action with no actions returns empty list', () => {
        const game = gameReducer({actionQueue: []}, {type: 'next_action'})
        expect(game.actionQueue).toEqual([])
    })

    test('mark_dead sets the player to dead', () => {
        const game = gameReducer({...sampleGame}, {type: 'mark_dead', playerName: 'ccc'})
        expect(game.players.find(player => player.name === 'ccc').dead).toEqual(true)
    })

    test('use_dead_vote sets deadVoteUsed pn player', () => {
        const game = gameReducer({
            ...sampleGame,
            players: sampleDeadVotePlayers
        }, {type: 'use_dead_vote', playerName: 'fff'})

        expect(game.players.find(player => player.name === 'fff').deadVoteUsed).toEqual(true)
    })

    // really need to define these errors.
    test('use_dead_vote exceptions if already true', () => {
        expect(gameReducer({
            ...sampleGame, 
            players: sampleDeadVotePlayers
        }, 
        {type: 'use_dead_vote', playerName: 'aaa'})).toThrow(Error)
    })

    test('use_dead_vote exceptions if player is not dead', () => {
        expect(gameReducer({
            ...sampleGame, 
            players: sampleDeadVotePlayers
        }, {type: 'used_dead_vote', playerName: 'ddd'})).toThrow(Error)
    })
})