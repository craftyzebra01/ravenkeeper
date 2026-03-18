import { useState } from "react";

const ScriptDisplay = ({scriptNames, selectedScript, dispatch, viewRoleCB, viewScriptOrderCB}) => {

    return (
        <div className='script-display-container'>
            <select
                value={selectedScript.name}
                onChange={(e) => {dispatch({type: 'set_script', scriptName: e.target.value})}}
            >
                {scriptNames.map(script => (
                    <option key={script} value={script}>
                        {script}
                    </option>
                ))}
            </select>
            <button onClick={viewRoleCB}>Roles</button>
            <button onClick={viewScriptOrderCB}>Script Order</button>
        </div>
    )
}

export default ScriptDisplay;