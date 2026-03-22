import PlayersDisplay from "./PlayersDisplay";
import ScriptDisplay from "./ScriptDisplay"
import { isBetween } from "../utils/gameLogic";
import NextPhaseButton from "./NextPhaseButton";

const Grimoire = ({game, dispatch}) => {

    return (
        <div>
            {game.phase === 'setup' && (
            <ScriptDisplay 
                selectedScript={game.script}
                dispatch={dispatch}
            />
            )}
            <PlayersDisplay
                players={game.players}
                dispatch={dispatch}
            />
            {/* <button onClick={handleStartGame} disabled={game.players.length < 5 || game.players.length > 15}>{renderButtonText()}</button> */}
            {/* this button should probably be moved into the game container???  */}
            <NextPhaseButton
                phase={game.phase}
                dispatch={dispatch}
            />
            <button onClick={() => {dispatch({type: 'reset_game'})}}>Reset</button>
        </div>
    )
}

export default Grimoire;