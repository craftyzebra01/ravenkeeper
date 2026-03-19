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
                players: [...game.players, {name: action.playerName}]
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
        // This should be set_phase? instead?
        case 'next_phase': {
            const np = nextPhase[game.phase]
            switch(game.phase) {
                case 'setup':
                    const players = assignRoles(game.players, game.roles)
                    return {
                        ...game,
                        phase: np,
                        players: players,
                        actionQueue: players.map(player => {
                            return {
                                playerName: player.name,
                                visibleMessage: '',
                                hiddenMessage: `${player.role.name} - ${player.role.type} ${player.role.description}`
                            }
                        })
                    }
                case 'preGame':
                    // first night phase
                    // map something with filter on players.roles v action 
                    return {
                        ...game,
                        phase: np
                    }
                default:
                    return {
                        ...game,
                        phase: np
                    }
            }
        }
        case 'reset_game': {
            return initialGame
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

const samplePlayers = [
    {name: 'Patrick'},
    {name: 'Stephanie'},
    {name: 'Dennis'},
    {name: 'John'},
    {name: 'Hee Yeon'},
]

export const initialGame = {
    phase: 'setup',
    overlay: 'main', // [grimoire,roleInfo,scriptOrder,night(?)]
    players: samplePlayers,
    script: allScripts[0],
    roles: allScripts[0].roles
};