import { useState } from 'react';
import { roleTypeBg } from '../utils/roleColors';

const Night = ({phase, action, dispatch}) => {
    const [revealed, setRevealed] = useState(false);

    const handleNextClick = () => {
        setRevealed(false);
        dispatch({type: 'next_action'});
    }

    const hiddenBg = action.role?.team ? roleTypeBg[action.role.team] : 'bg-slate-700';

    return (
        <div className='flex flex-col items-center gap-6 bg-slate-800 rounded-xl p-8 text-center'>
            {action.playerName && (
                <p className='text-3xl font-bold text-white'>{action.playerName}</p>
            )}
            {action.name && !action.playerName && (
                <p className='text-xl font-semibold text-white/70'>{action.name}</p>
            )}
            <div className={`text-white text-lg w-full rounded-lg px-4 py-3 ${phase !== 'preGame' ? hiddenBg : '' }`}>
                {action.visibleMessage}
            </div>

            {action.hiddenMessage && (
                <div className='w-full flex flex-col items-center gap-3'>
                    {revealed ? (
                        <div className={`w-full rounded-lg px-4 py-3 text-white text-sm ${hiddenBg}`}>
                            {action.hiddenMessage}
                        </div>
                    ) : (
                        <button
                            onClick={() => setRevealed(true)}
                            className='px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors'
                        >
                            Reveal
                        </button>
                    )}
                </div>
            )}

            <button
                onClick={handleNextClick}
                className='px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors'
            >
                Next
            </button>
        </div>
    )
}

export default Night;
