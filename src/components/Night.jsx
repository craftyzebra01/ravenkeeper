
const Night = ({action, dispatch}) => {
    /*
    * action schema:
    * - name
    * - visible text
    * - hidden text
    * - background colors or css classes?
    */

    const handleNextClick = () => {
        dispatch({type: 'next_action'})
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