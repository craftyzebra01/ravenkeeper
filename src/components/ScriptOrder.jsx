import {useState} from 'react';

const ScriptOrder = ({firstNight, otherNight}) => {
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
            </div>
        </div>
    )
}

export default ScriptOrder;