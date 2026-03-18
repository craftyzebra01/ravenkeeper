const RoleInfo = ({roles}) => {
    return (
        <div>
            <div className='roles-display'>
                <ul className='role-list'>
                    {roles.map(role => (
                        <li key={role.name} className='role-row'>
                            <div>{role.name}</div>
                            <div>{role.type}</div>
                            <div>{role.description}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default RoleInfo