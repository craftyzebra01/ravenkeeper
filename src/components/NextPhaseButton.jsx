// This thing can be refactored I lost the reason I did it this way.
const NextPhaseButton = ({phase, dispatch}) => {
    switch(phase) {
        case 'setup':
            return (
                <button className='flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors' onClick={() => {
                    dispatch({type: 'next_phase'})
                }}>
                    Start Game
                </button>
            )
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