import {assignRoles, gameReducer, getInitialGame} from './gameLogic'
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
    {name: 't1', team: 'townsfolk', ability: 'test ability 1'},
    {name: 't2', team: 'townsfolk', ability: 'test ability 2'},
    {name: 't3', team: 'townsfolk', ability: 'test ability 3'},
    {name: 't4', team: 'minion', ability: 'test ability 4'},
    {name: 't5', team: 'demon', ability: 'test ability 5'}
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

describe('role selection', () => {
    test('add role adds the name to game.selectedRoles', () => {
        const game = gameReducer({selectedRoles: []}, {
            type: 'add_role',
            role: {name: 'testRole'}
        })
        expect(game.selectedRoles).toEqual([{name: 'testRole'}])
    })

    test('del_role removes the name from game.selectedRoles', () => {
        const game = gameReducer({selectedRoles: [{name: 'test123'}]}, {
            type: 'del_role',
            roleName: 'test123'
        })
        expect(game.selectedRoles).toEqual([])
    })
})

describe('set script', () => {
    test('set_script resets selectedRoles', () => {
        const game = gameReducer({}, {
            type: 'set_script',
            scriptName: 'Trouble Brewing'
        })

        expect(game.selectedRoles).toEqual([])
    })
})

describe('reducer: assign_roles', () => {
    test('assign_roles role should be assigned to a player', () => {
        const game = gameReducer(
            {
                players: samplePlayers,
                selectedRoles: sampleRoles
            },
            {type: 'assign_roles'})
        
        expect(sampleRoles.every(v => 
            game.players.some(p => p.role === v)
        )).toBe(true)
    })

    test(`assign_roles errors if players
        and selectedRoles are not the same length`, () => {
        expect(() => gameReducer(
            {
                players:samplePlayers,
                selectedRoles: sampleRoles.slice(0, 2)
            },
            {type: 'assign_roles'}
        )).toThrow()
    })
})

describe('gameLogic', () => {
    test('set_script updates parameters', () => {
        const game = gameReducer({}, {
            type: 'set_script',
            scriptName: 'Trouble Brewing'
        })

        expect(game.script.name).toEqual('Trouble Brewing')
    })

    test('set_overlay', () => {
        const overlay ='grimoire'
        const game = gameReducer({}, {
            type: 'set_overlay',
            overlay: overlay
        })
        expect(game.overlay === overlay).toBeTruthy()
    })

    test('set_overlay toggles back to main when same overlay is set', () => {
        const game = gameReducer({overlay: 'grimoire'}, {type: 'set_overlay', overlay: 'grimoire'})
        expect(game.overlay).toEqual('main')
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
        expect(game.players).toEqual([{name: 'aaa', dead: true}, {name: 'bbb', dead: false, tags: []}])
        expect(game.players).toHaveLength(2)
    })

    // worth adding tests for nextPhase transition?
    test('next_phase setup -> preGame', () => {
        const game = gameReducer({players: samplePlayers, roles: sampleRoles, phase: 'setup'}, {type: 'next_phase'})

        expect(game.phase).toEqual('preGame')
    })

    test('next_phase setup should create actionQueue', () => {
        const game = gameReducer({players: samplePlayers, roles: sampleRoles, phase: 'setup'}, {'type': 'next_phase'})

        expect(game.actionQueue).toHaveLength(6)
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
        const game = gameReducer({...sampleGame, phase: 'day'}, {type: 'next_phase'})

        expect(game.phase).toEqual('otherNight')
    })
    test('next_phase otherNight -> day', () => {
        const game = gameReducer({phase: 'otherNight'}, {type: 'next_phase'})

        expect(game.phase).toEqual('day')
    })

    test('reset_game returns initialGame', () => {
        expect(gameReducer({}, {type: 'reset_game'})).toEqual(getInitialGame())
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
    test('use_dead_vote throws if dead vote already used', () => {
        expect(() => gameReducer({
            ...sampleGame,
            players: [{name: 'zzz', dead: true, deadVoteUsed: true}]
        },
        {type: 'use_dead_vote', playerName: 'zzz'})).toThrow(Error)
    })

    test('use_dead_vote throws if player is not dead', () => {
        expect(() => gameReducer({
            ...sampleGame,
            players: sampleDeadVotePlayers
        }, {type: 'use_dead_vote', playerName: 'ddd'})).toThrow(Error)
    })

    test('move_player moves player up', () => {
        const game = gameReducer(
            {players: [{name: 'aaa'}, {name: 'bbb'}, {name: 'ccc'}]},
            {type: 'move_player', playerName: 'bbb', direction: 'up'}
        )
        expect(game.players.map(p => p.name)).toEqual(['bbb', 'aaa', 'ccc'])
    })

    test('move_player moves player down', () => {
        const game = gameReducer(
            {players: [{name: 'aaa'}, {name: 'bbb'}, {name: 'ccc'}]},
            {type: 'move_player', playerName: 'bbb', direction: 'down'}
        )
        expect(game.players.map(p => p.name)).toEqual(['aaa', 'ccc', 'bbb'])
    })

    test('move_player does nothing when moving first player up', () => {
        const players = [{name: 'aaa'}, {name: 'bbb'}, {name: 'ccc'}]
        const game = gameReducer(
            {players},
            {type: 'move_player', playerName: 'aaa', direction: 'up'}
        )
        expect(game.players.map(p => p.name)).toEqual(['aaa', 'bbb', 'ccc'])
    })

    test('move_player does nothing when moving last player down', () => {
        const players = [{name: 'aaa'}, {name: 'bbb'}, {name: 'ccc'}]
        const game = gameReducer(
            {players},
            {type: 'move_player', playerName: 'ccc', direction: 'down'}
        )
        expect(game.players.map(p => p.name)).toEqual(['aaa', 'bbb', 'ccc'])
    })

    test('unknown action type returns game unchanged', () => {
        const state = {phase: 'setup', players: [{name: 'aaa'}]}
        const game = gameReducer(state, {type: 'not_a_real_action'})
        expect(game).toEqual(state)
    })

    test('add_tag adds a tag to the correct player', () => {
        const state = {players: [{name: 'aaa', tags: []}, {name: 'bbb', tags: []}]}
        const game = gameReducer(state, {type: 'add_tag', playerName: 'aaa', tag: 'Red Herring'})
        expect(game.players.find(p => p.name === 'aaa').tags).toEqual(['Red Herring'])
        expect(game.players.find(p => p.name === 'bbb').tags).toEqual([])
    })

    test('add_tag appends to existing tags', () => {
        const state = {players: [{name: 'aaa', tags: ['Power Used']}]}
        const game = gameReducer(state, {type: 'add_tag', playerName: 'aaa', tag: 'Red Herring'})
        expect(game.players.find(p => p.name === 'aaa').tags).toEqual(['Power Used', 'Red Herring'])
    })

    test('add_tag handles missing tags field gracefully', () => {
        const state = {players: [{name: 'aaa'}]}
        const game = gameReducer(state, {type: 'add_tag', playerName: 'aaa', tag: 'Poisoned'})
        expect(game.players.find(p => p.name === 'aaa').tags).toEqual(['Poisoned'])
    })

    test('remove_tag removes the tag at the given index', () => {
        const state = {players: [{name: 'aaa', tags: ['Power Used', 'Red Herring', 'Poisoned']}]}
        const game = gameReducer(state, {type: 'remove_tag', playerName: 'aaa', index: 1})
        expect(game.players.find(p => p.name === 'aaa').tags).toEqual(['Power Used', 'Poisoned'])
    })

    test('remove_tag only affects the correct player', () => {
        const state = {players: [{name: 'aaa', tags: ['Power Used']}, {name: 'bbb', tags: ['Red Herring']}]}
        const game = gameReducer(state, {type: 'remove_tag', playerName: 'aaa', index: 0})
        expect(game.players.find(p => p.name === 'aaa').tags).toEqual([])
        expect(game.players.find(p => p.name === 'bbb').tags).toEqual(['Red Herring'])
    })
})
