import { allScripts } from "./scripts/allScripts.js"
import roles from "./roles.json"

export const getScripts = () => {
    return allScripts.map(script => ({
        name: script.name,
        firstNight: script.firstNight,
        otherNight: script.otherNight,
        roles: script.roles
            .map(roleName => roles.find(r => r.name === roleName))
            .filter((r) => r !== undefined)
    }))
}

