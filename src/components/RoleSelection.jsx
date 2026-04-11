import { roleTypeBg } from "../utils/roleColors"

const ROLE_TYPES = ['townsfolk', 'outsider', 'minion', 'demon']

const RoleSelection = ({roles, selectedRoles, dispatch}) => {
    const handleRoleClick = (role) => {
        if (selectedRoles.some(sr => sr.name === role.name)) {
            dispatch({type: 'del_role', role: role.name})
        } else {
            dispatch({type: 'add_role', role: role})
        }
    }

    if (!roles) { return null }
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-2'>
                {ROLE_TYPES.map(team => (
                    <div key={team} className={`flex-1 flex flex-col items-center rounded-lg px-2 py-2 ${roleTypeBg[team]}`}>
                        <span className='text-xs text-white/70 uppercase tracking-wide'>{team}</span>
                        <span className='text-lg font-bold text-white'>
                            {selectedRoles.filter(sr => sr.team === team).length}
                        </span>
                    </div>
                ))}
            </div>
            {ROLE_TYPES.map(team => {
                const inRoles = roles.filter(r => r.team === team)
                if (!inRoles.length) { return null }
                return (
                    <div key={team} className='flex flex-col gap-1'>
                        <span className='text-xs text-slate-400 font-medium uppercase tracking-wide'>{team}</span>
                        <div className='flex flex-col gap-1'>
                            {inRoles.map(r => {
                                const selected = selectedRoles.some(sr => sr.name === r.name)
                                return (
                                    <button
                                        key={r.name}
                                        onClick={() => handleRoleClick(r)}
                                        className={`flex items-center justify-between rounded-lg px-4 py-2 text-left transition-colors ${selected ? `${roleTypeBg[team]} text-white` : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                                    >
                                        <span className='text-sm font-medium'>{r.name}</span>
                                        {selected && <span className='text-white/70 text-sm'>✓</span>}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default RoleSelection
