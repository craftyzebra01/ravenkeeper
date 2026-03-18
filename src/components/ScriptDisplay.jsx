import { useState } from "react";
import { allScripts } from "../data/scripts/allScripts";

const ScriptDisplay = ({selectedScript, dispatch}) => {

    return (
        <div className='script-display-container'>
            <select
                value={selectedScript.name}
                onChange={(e) => {dispatch({type: 'set_script', scriptName: e.target.value})}}
            >
                {allScripts.map(script => (
                    <option key={script.name} value={script.name}>
                        {script.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default ScriptDisplay;