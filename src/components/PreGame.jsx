import React, {useState} from 'react';

// Sccren For displaying pre game (show each player their role)
// Flow
// Show player -> click reveal role

const PreGame = ({players, endFn}) => {
    const [index, setIndex] = useState(0);
    const [displayingRole, setDisplayingrole] = useState(false);

    const handlePass = () => {
        setIndex(index++);
        setDisplayingrole(false)
    }

    // update this to display like a colored background or something?
    const displayRole = (showRole) => {
        if (showRole) {
            return (
                <div>
                    <div>
                        You are the: {players.role.name}
                        {players.role.description}
                    </div>
                    <button onClick={handlePass}>Pass</button>
                </div>
            )
        }
        
        return (
            <div>
                <button onClick={setDisplayingrole(true)}>Reveal Role</button>
            </div>
        )
    }

    if (index > players.length - 1) {
        return (
            <div>
                <h3>Pre Game</h3>
                <button onClick={endfn}>I am the storyteller.</button>
            </div>
        )
    }

    return (
        <div>
            <h3>Pre Game</h3>
            <p>Hello {players[index].name}</p>

            {displayRole(displayingRole)}
        </div>
    )
}