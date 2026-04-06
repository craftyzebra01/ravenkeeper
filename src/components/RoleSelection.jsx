import { roleTypeBg } from "../utils/roleColors"

const ROLE_TYPES = ['townsfolk', 'outsider', 'minion', 'demon']



const RoleSelection = ({roles}) => {
    if (!roles) { return null }
    return (
        <div className='flex flex-col gap-4'>
            {ROLE_TYPES.map(team => {
                const inRoles = roles.filter(r => r.team === team)
                if (!roles) { return null }
                return (
                    <div key={team} className={`rounded-xl p-4 ${roleTypeBg[team]}`}>
                        <ul>
                            {inRoles.map(r => (
                                <li key={r.name}
                                    className='text-sm text-white'>
                                    <div className='font-medium'>{r.name}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            })}
            <button className={`px-4 py-2 rounded-lg text-sm bg-slate-800 
                text-slate-400 hover:bg-slate-700 transition-colors`}>
                Select
            </button>
        </div>
    )
}

export default RoleSelection
