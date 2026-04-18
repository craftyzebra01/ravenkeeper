type Player = {
    name: string,
    role: Role,
    tags: Array<string>,
    dead: boolean,
    deadVoteUsed: boolean
}

type Action = {
    role: Role,
    playerName: string,
    visibleMessage: string,
    hiddenMessage: string
}

type Role = {
    name: string,
    ability: string,
    night: string,
    firstNight: string,
    otherNight: string,
    team: string
}

type GameState = {
   phase: string,
   overlay: string,
   players: Array<Player>,
   actionQueue: Array<Action>,
   selectedRoles: Array<Role>
}

