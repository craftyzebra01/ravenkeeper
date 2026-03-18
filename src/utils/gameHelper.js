// access math = playercount - 5 (5-5=>0, 6-5=>1)
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

export const nextPhase = {
    setup: 'preGame',
    preGame: 'firstNight',
    firstNight: 'day',
    day: 'otherNight',
    otherNight: 'day'
}

const roleMapping = ["townsfolk", "outsider", "minion", "demon"];

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