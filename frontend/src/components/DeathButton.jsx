
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

    const btnClass = !dead
        ? 'bg-rose-800 hover:bg-rose-700 text-white'
        : deadVoteUsed
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-amber-700 hover:bg-amber-600 text-white';

    return (
        <button onClick={handleClick} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${btnClass}`}>
            {renderButtonText()}
        </button>
    )
}

export default DeathButton