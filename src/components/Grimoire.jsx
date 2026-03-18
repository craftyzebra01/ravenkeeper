import PlayersDisplay from "./PlayersDisplay";
import ScriptDisplay from "./ScriptDisplay"

const Grimoire = ({game, dispatch}) => {
    console.log(game.players)
    return (
        <div>
            <ScriptDisplay 
                selectedScript={game.script}
                dispatch={dispatch}
            />
            <PlayersDisplay
                players={game.players}
                dispatch={dispatch}
            />
        </div>
    )
}

export default Grimoire;