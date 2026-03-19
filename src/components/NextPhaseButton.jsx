
const NextPhaseButton = ({phase, dispatch}) => {
    switch(phase) {
        case 'setup':
            return (
                <button onClick={() => {
                    console.log(`[${phase}] Start Game pressed...`)
                    dispatch({type: 'assign_roles'})
                    dispatch({type: 'next_phase'}
                    )
                }}
                >
                    Start Game
                </button>
            )
        case 'preGame':
            return (
                <button onClick={() => {
                    console.log(`[${phase}] First Night pressed...`)
                    dispatch({type: 'next_phase'})
                }}
                >
                    First Night
                </button>
            )
        case 'firstNight':
        case 'otherNight':
            return (
                <button onClick={() => {
                    console.log(`[${phase}] Day pressed from ${phase}`)
                    dispatch({type: 'next_phase'})
                }}
                >
                    Day
                </button>
            )
        case 'day':
            return (
                <button onClick={() => {
                    console.log(`[${phase}] Night pressed...`)
                    dispatch({type: 'next_phase'})
                }}
                >
                    Night
                </button>
            )
        default:
            console.log(`Reached default with phase: ${phase}`)
            return (
                <button>Next Phase Button</button>
            )
    }
}

export default NextPhaseButton