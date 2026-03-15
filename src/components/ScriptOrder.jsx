import React, {useState, useEffect} from 'react';

const ScriptOrder = ({firstNight, otherNight, backFn}) => {
    const [viewFirst, setViewFirst] = useState(true);

    const handleFlipScript = () => {
        setViewFirst(!viewFirst);
    }

    return (
        <div>
            <ul>
                <h3>{viewFirst ? 'First Night' : 'Other Nights'}</h3>
                {(viewFirst ? firstNight : otherNight).map( (step, index) => {
                    return <li key={step || index}>{step}</li>
                })}
            </ul>
            <div className='rd-buttons'>
                <button onClick={handleFlipScript}>Flip</button>
                <button onClick={backFn}>Return</button>
            </div>
        </div>
    )
}

export default ScriptOrder;