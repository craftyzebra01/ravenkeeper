import { roleTypeBg } from "../utils/roleColors"

const ROLE_TYPES = ['townsfolk', 'outsider', 'minion', 'demon']

const RoleInfo = ({roles}) => {
    return (
        <div className='flex flex-col gap-4'>
            {ROLE_TYPES.map(type => {
                const group = roles.filter(r => r.team === type)
                if (group.length === 0) return null
                return (
                    <div key={type} className={`rounded-xl p-4 ${roleTypeBg[type]}`}>
                        <h3 className='text-sm font-semibold uppercase tracking-wide text-white/70 mb-3 capitalize'>{type}</h3>
                        <ul className='grid grid-cols-2 gap-2'>
                            {group.map(role => (
                                <li key={role.name} className='text-sm text-white'>
                                    <div className='font-medium'>{role.name}</div>
                                    <div className='text-xs text-white/60'>{role.ability}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            })}
        </div>
    )
}

export default RoleInfo
