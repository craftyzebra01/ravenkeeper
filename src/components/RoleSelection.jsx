import { roleTypeBg } from "../utils/roleColors"
import { } from "../utils/gameLogic"

const ROLE_TYPES = ['townsfolk', 'outsider', 'minion', 'demon']



const RoleSelection = ({roles, selectedRoles, dispatch}) => {
    const handleRoleClick = (role) => {
        if(selectedRoles.some(sr => sr.name === role.name)) {
            dispatch({type: 'del_role', role: role.name})
        }
        else {
            dispatch({type: 'add_role', role: role})
        }
    }
    
    const getLIClasses = (roleName) => {
        if((selectedRoles ?? []).some(sr => sr.name === roleName)) {
            return 'text-sm text-white m-2 ring-2 ring-white'
        }

        return 'text-sm text-white m-2'
    }

    if (!roles) { return null }
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-center gap-4'>
                {ROLE_TYPES.map(team => (
                    <div key={team}>
                        {selectedRoles.filter(sr => sr.team === team).length}
                    </div>
                ))}
            </div>
            {ROLE_TYPES.map(team => {
                const inRoles = roles.filter(r => r.team === team)
                if (!inRoles) { return null }
                return (
                    <div key={team} className={`rounded-xl p-4 ${roleTypeBg[team]}`}>
                        <ul>
                            {inRoles.map(r => (
                                <li key={r.name}
                                    className={getLIClasses(r.name)}
                                    onClick={() => {handleRoleClick(r)}}
                                >
                                    <div className='font-medium'>{r.name}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            })}
        </div>
    )
}

export default RoleSelection
