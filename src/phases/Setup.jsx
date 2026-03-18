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
    const [viewRoles, setViewRoles] = useState(false)
    const [viewScriptOrder, setViewScriptOrder] = useState(false)

    if (viewRoles) {
        console.log("Viewing roles...")
        return (
            <div>
                <RolesDisplay
                    roles={selectedScript.roles}
                    backFn={() => setViewRoles(false)}
                />
            </div>
        )
    }

    if (viewScriptOrder) {
        return (
            <ScriptOrderDisplay
                firstNight={selectedScript.firstNight}
                otherNight={selectedScript.otherNight}
                backFn={() => setViewScriptOrder(false)}
            />
        )
    }

    return (
        <div className='setup-container'>
            <ScriptDisplay
                scriptNames={scriptNames}
                selectedScript={selectedScript}
                dispatch={dispatch}
                viewRoleCB={() => setViewRoles(true)}
                viewScriptOrderCB={() => setViewScriptOrder(true)}
            />
            <button>Start Game</button>
        </div>
    )
}

export default Setup;
