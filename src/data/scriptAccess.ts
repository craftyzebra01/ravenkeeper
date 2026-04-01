import { allScripts } from "./scripts/allScripts.js"
import roles from "./roles.json" with {type: "json"}

type RoleBase = {
    name: string,
    ability: string,
    team: string,
}

export type Role = RoleBase & (
    | { night: string }
    | { firstNight: string; otherNight: string }
    | object
)

export type Script = {
    name: string,
    firstNight: Array<string>,
    otherNight: Array<string>,
    roles: Array<Role>
}

export const getScripts = (): Array<Script> => {
    return allScripts.map(script => ({
        name: script.name,
        firstNight: script.firstNight,
        otherNight: script.otherNight,
        roles: script.roles
            .map(roleName => roles.find(r => r.name === roleName))
            .filter((r): r is Role => r !== undefined)
    }))
}

