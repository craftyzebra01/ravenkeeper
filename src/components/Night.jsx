import {useState} from 'react'

const Night = ({actionQueue, dispatch}) => {
    /*
    * action schema:
    * - name
    * - visible text
    * - hidden text
    * - background colors or css classes?
    */

    // This feels iffy.
    const [queueIndex, setQueueIndex] = useState(0);
    const action = actionQueue[queueIndex]

    const handleNextClick = () => {
        if(queueIndex >= actionQueue.length - 1) {
            dispatch({type: 'next_phase'})
        }
        else {
            setQueueIndex(queueIndex + 1)
        }
    }

    const renderHiddenMessage = () => {
        return (
            <div>
                <button>Reveal</button>
                This message should be invisible
                {action.hiddenMessage}
            </div>
        )
    }

    return (
        <div>
            Hello {action.playerName}
            {action.visibleMessage}
            {renderHiddenMessage()}
            <button onClick={handleNextClick}
            >
                Next
            </button>
        </div>
    )
}

export default Night;