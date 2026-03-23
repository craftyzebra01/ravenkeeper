import PlayersDisplay from "./PlayersDisplay";
import ScriptDisplay from "./ScriptDisplay"
import { isBetween } from "../utils/gameLogic";
import NextPhaseButton from "./NextPhaseButton";

const Grimoire = ({game, dispatch}) => {

    return (
        <div className='flex flex-col gap-4'>
            {game.phase === 'setup' && (
            <ScriptDisplay
                selectedScript={game.script}
                dispatch={dispatch}
            />
            )}
            <PlayersDisplay
                players={game.players}
                phase={game.phase}
                dispatch={dispatch}
            />
            <div className='flex gap-2'>
                <NextPhaseButton
                    phase={game.phase}
                    dispatch={dispatch}
                />
                <button className='px-4 py-2 rounded-lg text-sm bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors' onClick={() => {dispatch({type: 'reset_game'})}}>Reset</button>
            </div>
        </div>
    )
}

export default Grimoire;