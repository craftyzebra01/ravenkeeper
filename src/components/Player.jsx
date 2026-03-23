import React, {useState} from 'react';

const Player = ({name, roleName, roleType}) => {

    // return (
    //     <div>
    //         {name} - {role}
    //     </div>
    // )
    return (
        <div>
            <div className='font-medium text-white'>{name}</div>
            {roleType && roleName && (
                <div className='text-xs text-slate-400'>{roleType} — {roleName}</div>
            )}
        </div>
    )
}

export default Player;