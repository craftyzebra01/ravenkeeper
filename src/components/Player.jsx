import React, {useState} from 'react';

const Player = ({name, role}) => {

    return (
        <div>
            <p>{name}</p>
            {role && <span> - {role}</span>}
        </div>
    )
}

export default Player;