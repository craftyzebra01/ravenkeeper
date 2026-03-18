import PlayersDisplay from "./PlayersDisplay";
import ScriptDisplay from "./ScriptDisplay"

const Grimoire = ({game, dispatch}) => {
    return (
        <div>
            <ScriptDisplay
                scriptNames={game.scriptNames}
                selectedScript={game.selectedScript}
            />
            <PlayersDisplay
                players={game.players}
            />
        </div>
    )
}

export default Grimoire;