import {allScripts} from '../data/scripts/allScripts'
import roles from '../data/roles.json'

export const mapToRoleObjects = (names, roles) => names.map(name => roles.find(r => r.name === name))

export function gameReducer(game, action) {
    switch (action.type) {
        case 'set_script': {
            const script = allScripts.find(s => s.name == action.scriptName)
            return {
                ...game,
                script,
                roles: mapToRoleObjects(script.roles, roles),
                firstNight: mapToRoleObjects(script.firstNight, roles),
                otherNight: mapToRoleObjects(script.otherNight, roles)
            }
        }
        case 'set_overlay': {
            return {
                ...game,
                overlay: action.overlay === game.overlay ? 'main' : action.overlay
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
                players: [...game.players, {name: action.playerName, dead: false}]
            }
        }
        case 'assign_roles': {
            if (!isBetween(game.players.length, 5, 15)) {
                throw RangeError(`game.players.length must be between 5 and 15 inclusive.`)
            }

            return {
                ...game,
                players: assignRoles(game.players, game.roles)
            }
        }
        case 'next_phase': {
            // right now this handles game state transitions in the current phase
            // perhaps it would make more sense to transition first and switch on that
            // so 'preGame' would be responsible for setting up preGame actions
            const np = nextPhase[game.phase]
            switch(game.phase) {
                case 'setup':
                    const players = assignRoles(game.players, game.roles)
                    return {
                        ...game,
                        phase: np,
                        players: players,
                        overlay: 'main',
                        actionQueue: createPreGameActions(players)
                    }
                case 'preGame':
                    return {
                        ...game,
                        phase: np,
                        overlay: 'main',
                        actionQueue: createNightActions(game.players, specialActions, game.firstNight)
                    }
                case 'day':
                    return {
                        ...game,
                        phase: np,
                        actionQueue: createNightActions(game.players, specialActions, game.otherNight)
                    }
                default:
                    return {
                        ...game,
                        phase: np
                    }
            }
        }
        case 'move_player': {
            const players = [...game.players];
            const i = players.findIndex(p => p.name === action.playerName);
            const j = action.direction === 'up' ? i - 1 : i + 1;
            if (j < 0 || j >= players.length) return game;
            [players[i], players[j]] = [players[j], players[i]];
            return { ...game, players };
        }
        case 'reset_game': {
            return initialGame
        }
        case 'next_action': {
            const remaining = game.actionQueue ? game.actionQueue.slice(1) : [];
            if (remaining.length === 0) {
                const np = nextPhase[game.phase];
                if (game.phase === 'preGame') {
                    return {
                        ...game,
                        phase: np,
                        actionQueue: createNightActions(game.players, specialActions, game.firstNight)
                    };
                }
                return { ...game, phase: np, actionQueue: [] };
            }
            return { ...game, actionQueue: remaining };
        }
        case 'mark_dead': {
            return {
                ...game,
                players: game.players.map(player => {
                    return {...player,
                        dead: player.name === action.playerName ? true : player.dead
                    }
                })
            }
        }
        case 'use_dead_vote': {
            const updatedPlayers = game.players.map(player => {
                if(player.name === action.playerName) {
                    if (player.dead === false) {
                        throw Error(`use_dead_vote - player: ${playerName} is not dead.`)
                    }
                    if (player.deadVoteUsed) {
                        throw Error(`use_dead_vote - player: ${playerName} has already used their dead vote.`)
                    }

                    return {
                        ...player,
                        deadVoteUsed: true
                    }
                }

                return player
            })

            return {
                ...game, 
                players: updatedPlayers
            }
        }
        default: 
            return game;
    }
}

export const nextPhase = {
    setup: 'preGame',
    preGame: 'firstNight',
    firstNight: 'day',
    otherNight: 'day',
    day: 'otherNight'
}

const roleCounts = [
    [3, 0, 1, 1], // what is the pattern here?
    [3, 1, 1, 1],
    [5, 0, 1, 1],
    [5, 1, 1, 1],
    [5, 2, 1, 1],
    [7, 0, 2, 1],
    [7, 1, 2, 1],
    [7, 2, 2, 1],
    [9, 0, 3, 1],
    [9, 1, 3, 1],
    [9, 2, 3, 1]
]

export const shuffleArray = (arr) => {
        if (!arr) {return []};
        const clone = [...arr];
        
        for(let i = clone.length - 1; i >= 0; i--) {
            let j = Math.floor(Math.random() * (i+1));
            [clone[i], clone[j]] = [clone[j], clone[i]];
        }

        return clone;
    }

export const assignRoles = (players, roles) => {
    if(players.length < 5 || players.length > 15) {
        throw new RangeError('players.length must be between 5 and 15 inclusive.')
    }

    // Generate a randomized list of roles.
    // Selected Random roles roleCounts[players.length] times
    // Assign to players leaving it in the same order (displayer will affect this).
    //  Potential improvement is to add a display position property.
    // const randomRoles = shuffleArray(roleCounts[players.length].map((c, index) => {
    //     return shuffleArray(roles.filter(role => role.type === roleMapping[index])).slice(0, c);
    // }).flat());
    const roleMap = shuffleArray(roleCounts[players.length - 5].map((c, index) => {
        return shuffleArray(roles.filter(role => role.type === roleMapping[index])).slice(0, c);
    }).flat());
    // select the roleCounts amount of each type of role, accessed via searching scriptRoles
    // return a list of players with randomly assigned roles
    return players.map( (player, index) => ({...player, role: roleMap[index]}));
}

export const isBetween = (val, min, max) => {
    return val >= min && val <= max;
}

const roleMapping = ["townsfolk", "outsider", "minion", "demon"]

export const initialGame = {
    phase: 'setup',
    overlay: 'main', // [grimoire,roleInfo,scriptOrder,night(?)]
    players: [],
    script: allScripts[0],
    roles: mapToRoleObjects(allScripts[0].roles, roles),
    firstNight: mapToRoleObjects(allScripts[0].firstNight, roles),
    otherNight: mapToRoleObjects(allScripts[0].otherNight, roles)
};

const createPreGameActions = (players) => {
    const actions = players.map(player => ({
        playerName: player.name,
        visibleMessage: '',
        hiddenMessage: `${player.role.name} - ${player.role.team} ${player.role.ability}`,
        role: player.role
    }));
    actions.push({ name: 'Begin First Night', visibleMessage: 'All players have seen their roles. Begin the first night.' });
    return actions;
}

/*
    Special actions:
    - 'Minion Info'
    - 'Demon Info'
    - 'Dusk'
    - 'Dawn'
*/
const specialActions = [
    {name: 'Minion Info', vm: 'Wake up the minion(s) and point to the demon.'}, 
    {name: 'Demon Info', vm: 'Wake up the demon and point to the minion(s).'}, 
    {name: 'Dusk', vm: 'The night has begun.'}, 
    {name: 'Dawn', vm: 'Day shines once more.'}
]
const createNightActions = (players, specialActions, night) => {
    // accumulator -> new empty list []
    const actions = night.reduce((acc, currentValue) => {
        
        const sa = specialActions.find( action => action.name === currentValue)
        if(sa) {
            acc.push({
                name: sa.name,
                visibleMessage: sa.vm
            })
            return acc
        }

        const player = players.find(player => player.role.name === currentValue)
        if(player) {
            acc.push({
                ...player,
                visibleMessage: player.role.name + ' ' + player.role.ability
            }
            )
            return acc
        }
        
        return acc
    }, []);
    return actions;
}
