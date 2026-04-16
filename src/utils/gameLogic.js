import { getScripts } from '../data/scriptAccess.js'

export function gameReducer(game, action) {
    const scripts = getScripts()

    switch (action.type) {
        // This should be the ONLY place anything interacts with a script itself.
        case 'add_role': {
            return {
                ...game,
                selectedRoles: [...(game.selectedRoles ?? []), action.role]
            }
        }
        case 'del_role': {
            return {
                ...game,
                selectedRoles: (game.selectedRoles ?? []).filter(r => r.name !== action.role),
                players: (game.players ?? []).map(p =>
                    p.assignedRole?.name === action.role ? { ...p, assignedRole: undefined } : p
                )
            }
        }
        case 'set_script': {
            const script = scripts.find(s => s.name == action.scriptName) ?? game.script
            return {
                ...game,
                script,
                roles: script.roles,
                selectedRoles: [],
                players: (game.players ?? []).map(p => ({ ...p, assignedRole: undefined }))
            }
        }
        case 'set_player_role': {
            return {
                ...game,
                players: game.players.map(p =>
                    p.name === action.playerName ? { ...p, assignedRole: action.role ?? undefined } : p
                )
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
                players: [...game.players, {name: action.playerName, dead: false, tags: []}]
            }
        }
        case 'assign_roles': {
            // validate preconditions?
            return {
                ...game,
                players: randomlyAssignRoles(game.players, game.selectedRoles)
            }
        }
        case 'next_phase': {
            // right now this handles game state transitions in the current phase
            // perhaps it would make more sense to transition first and switch on that
            // so 'preGame' would be responsible for setting up preGame actions
            const np = nextPhase[game.phase]
            switch(game.phase) {
                case 'setup':
                    const players = randomlyAssignRoles(game.players, game.selectedRoles)
                    return {
                        ...game,
                        phase: 'preGame',
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
                        phase: 'firstNight',
                        overlay: 'main',
                        actionQueue: createNightActions(game.players, specialActions, game.script.firstNight)
                    }
                case 'day':
                    return {
                        ...game,
                        phase: 'otherNight',
                        actionQueue: createNightActions(game.players, specialActions, game.script.otherNight)
                    }
                case 'otherNight':
                    return {
                        ...game,
                        phase: 'day',
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
            return getInitialGame() 
        }
        case 'next_action': {
            const current = game.actionQueue?.[0]
            const players = (current?.role?.oneTimeDeadAbility && current?.name)
                ? game.players.map(p => p.name === current.name ? { ...p, deadAbilityUsed: true } : p)
                : game.players
            return {
                ...game,
                players,
                actionQueue: game.actionQueue ? game.actionQueue.slice(1) : []
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
                        throw Error(`use_dead_vote - player: ${action.playerName} is not dead.`)
                    }
                    if (player.deadVoteUsed) {
                        throw Error(`use_dead_vote - player: ${action.playerName} has already used their dead vote.`)
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
        case 'add_tag': {
            return {
                ...game,
                players: game.players.map(p =>
                    p.name === action.playerName
                        ? {...p, tags: [...(p.tags ?? []), action.tag]}
                        : p
                )
            }
        }
        case 'remove_tag': {
            return {
                ...game,
                players: game.players.map(p =>
                    p.name === action.playerName
                        ? {...p, tags: (p.tags ?? []).filter((_, i) => i !== action.index)}
                        : p
                )
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
        return shuffleArray(roles.filter(role => role.team === roleMapping[index])).slice(0, c);
    }).flat());
    // select the roleCounts amount of each type of role, accessed via searching scriptRoles
    // return a list of players with randomly assigned roles
    return players.map( (player, index) => ({...player, role: roleMap[index]}));
}

export const randomlyAssignRoles = (players, roles) => {
    if (players.length !== roles.length) {
        throw new Error(`players and roles must be the same length.`)
    }

    const locked = players.filter(p => p.assignedRole)
    const unassigned = players.filter(p => !p.assignedRole)
    const lockedRoleNames = new Set(locked.map(p => p.assignedRole.name))
    const remainingRoles = shuffleArray(roles.filter(r => !lockedRoleNames.has(r.name)))

    let i = 0
    return players.map(player => {
        if (player.assignedRole) {
            return { ...player, role: player.assignedRole, assignedRole: undefined }
        }
        return { ...player, role: remainingRoles[i++], assignedRole: undefined }
    })
}

export const isBetween = (val, min, max) => {
    return val >= min && val <= max;
}

const roleMapping = ["townsfolk", "outsider", "minion", "demon"]

// start using types here
export const getInitialGame = () => {
    const scripts = getScripts()
    return {
        phase: 'setup',
        overlay: 'main',
        players: [],
        script: scripts[0],
        roles: scripts[0].roles,
        actionQueue: [],
        selectedRoles: []
    }
}

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
        const shouldAct = player && (
            !player.dead ||
            player.role.actsWhenDead ||
            (player.role.oneTimeDeadAbility && !player.deadAbilityUsed)
        )
        if(shouldAct) {
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
