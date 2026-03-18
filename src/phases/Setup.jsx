import React, {useState} from 'react';
import Player from '../components/Player';
import ScriptDisplay from '../components/ScriptDisplay';
import RolesDisplay from '../components/RolesDisplay';
import ScriptOrderDisplay from '../components/ScriptOrderDisplay';
/*
 *  This screen is responsible for:
 *  - Selecting a Script
 *  - Adding/Remove/Arranging Players
 *  - Selecting which roles are available for the game to assign
 *  - Transitioning to the PreGame phase
 *      - Check for Enough Players
 *  - And it should probably not be named setup as it will be used for more
 *      than just the setup phase.
 */

const Setup = ({scriptNames, selectedScript, dispatch}) => {    
    return (
        <div className='setup-container'>
            <ScriptDisplay
                scriptNames={scriptNames}
                selectedScript={selectedScript}
                dispatch={dispatch}
            />
            <button>Start Game</button>
        </div>
    )
}

export default Setup;
