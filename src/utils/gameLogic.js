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
                    // first night phase
                    // map something with filter on players.roles v action 
                    const actions = createNightActions(game.players, specialActions, game.script.firstNight)
                    console.log(actions)
                    return {
                        ...game,
                        phase: np,
                        overlay: 'main',
                        actionQueue: createNightActions(game.players, specialActions, game.script.firstNight)
                    }
                case 'day':
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
            return {
                ...game,
                actionQueue: game.actionQueue ? game.actionQueue.filter((_, index) => index !== 0) : []
            }
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
    roles: allScripts[0].roles
};

const createPreGameActions = (players) => {
    return players.map(player => {
        return {
            playerName: player.name,
            visibleMessage: '',
            hiddenMessage: `${player.role.name} - ${player.role.type} ${player.role.description}`,
            role: player.role
        }
    })
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
    return night.reduce((acc, currentValue) => {
        
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
                visibleMessage: player.role.name + ' ' + player.role.description
            }
            )
            return acc
        }
        
        return acc
    }, [])
}
