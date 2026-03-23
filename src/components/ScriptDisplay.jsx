import { useState } from "react";
import { allScripts } from "../data/scripts/allScripts";

const ScriptDisplay = ({selectedScript, dispatch}) => {

    return (
        <div className='flex flex-col gap-1'>
            <label className='text-xs text-slate-400 font-medium uppercase tracking-wide'>Script</label>
            <select
                value={selectedScript.name}
                onChange={(e) => {dispatch({type: 'set_script', scriptName: e.target.value})}}
                className='w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
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