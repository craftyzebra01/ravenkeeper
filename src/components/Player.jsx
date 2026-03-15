import React, {useState} from 'react';

const Player = ({name, roleName, roleType}) => {

    // return (
    //     <div>
    //         {name} - {role}
    //     </div>
    // )
    return (
        <div style={{ textAlign: 'left'}}>
            <div>
                {name}
            </div>
            {roleType && roleName && (
                <div>
                    {roleType} - {roleName}
                </div>
            )}
        </div>
    )
}

export default Player;