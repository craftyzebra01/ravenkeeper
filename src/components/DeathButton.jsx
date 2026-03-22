
const DeathButton = ({playerName, dead, deadVoteUsed, dispatch}) => {
    const handleClick = () => {
        if(!dead){
            dispatch({type: 'mark_dead', playerName: playerName})
            return
        }

        if(!deadVoteUsed) {
            dispatch({type: 'use_dead_vote', playerName: playerName})
            return
        }
    }
    
    const renderButtonText = () => {
        if(!dead) {
            return 'Kill'
        }

        if(deadVoteUsed) {
            return 'Used'
        }

        return 'Dead Vote'
    }

    return (
        <button onClick={handleClick}>{renderButtonText()}</button>
    )
}

export default DeathButton