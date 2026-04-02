import {useState} from 'react';
import { roleTypeBg } from '../utils/roleColors';

const specialBg = 'bg-slate-700';

const ScriptOrder = ({firstNight, otherNight, roles}) => {
    const [viewFirst, setViewFirst] = useState(true);

    const handleFlipScript = () => {
        setViewFirst(!viewFirst);
    }

    const nights = [
        { label: 'First Night', key: 'first', steps: firstNight },
        { label: 'Other Nights', key: 'other', steps: otherNight },
    ]

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-2'>
                {nights.map(({ label, key }) => (
                    <button
                        key={key}
                        onClick={() => setViewFirst(key === 'first')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                            (key === 'first') === viewFirst
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <ul className='flex flex-col gap-2'>
                {(viewFirst ? firstNight : otherNight).map((step, index) => {
                    const role = roles?.find(r => r.name === step);
                    const bg = role ? (roleTypeBg[role.team] ?? specialBg) : specialBg;
                    const nightText = role?.night ?? (viewFirst ? role?.firstNight : role?.otherNight);
                    return (
                        <li key={step || index} className={`rounded-lg px-4 py-3 text-sm text-white ${bg}`}>
                            <div className='flex items-baseline gap-3'>
                                <span className='text-white/40 text-xs shrink-0'>{index + 1}</span>
                                <div>
                                    <div>{step}</div>
                                    {nightText && <div className='text-xs text-white/60 mt-0.5'>{nightText}</div>}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default ScriptOrder;