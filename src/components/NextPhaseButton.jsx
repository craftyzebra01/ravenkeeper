// This thing can be refactored I lost the reason I did it this way.
const NextPhaseButton = ({phase, dispatch, playerCount, selectedRoles}) => {
    switch(phase) {
        case 'setup': {
            const disabled = playerCount < 5 || playerCount > 15 || 
                playerCount !== selectedRoles.length
            const title = playerCount < 5
                ? `Need at least 5 players (${playerCount}/5)`
                : playerCount > 15
                ? `Too many players — max is 15 (${playerCount}/15)`
                : undefined;
            return (
                <button
                    className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${disabled ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                    onClick={() => { if (!disabled) dispatch({type: 'next_phase'}) }}
                    title={title}
                >
                    Start Game
                </button>
            )
        }
        case 'preGame':
            return (
                <button className='flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors' onClick={() => {
                    console.log(`[${phase}] First Night pressed...`)
                    dispatch({type: 'next_phase'})
                }}>
                    First Night
                </button>
            )
        case 'firstNight':
        case 'otherNight':
            return (
                <button className='flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors' onClick={() => {
                    console.log(`[${phase}] Day pressed from ${phase}`)
                    dispatch({type: 'next_phase'})
                }}>
                    Day
                </button>
            )
        case 'day':
            return (
                <button className='flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors' onClick={() => {
                    console.log(`[${phase}] Night pressed...`)
                    dispatch({type: 'next_phase'})
                }}>
                    Night
                </button>
            )
        default:
            console.log(`Reached default with phase: ${phase}`)
            return (
                <button className='flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors'>Next Phase Button</button>
            )
    }
}

export default NextPhaseButton
