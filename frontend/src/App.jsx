import React, { useState } from 'react';
import { useGameSocket, createRoom } from './hooks/useGameSocket';
import Grimoire from './components/Grimoire'
import RoleInfo from './components/RoleInfo';
import ScriptOrder from './components/ScriptOrder';
import Night from './components/Night'

function Lobby({ onRoomCreated }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async () => {
        setLoading(true);
        setError('');
        try {
            const code = await createRoom();
            onRoomCreated(code);
        } catch {
            setError('Could not reach server. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 gap-6">
            <h1 className="text-3xl font-bold text-slate-100">Ravenkeeper</h1>
            <p className="text-slate-400 text-sm">Blood on the Clocktower Storyteller Tool</p>
            <button
                onClick={handleCreate}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-medium px-8 py-3 transition-colors"
            >
                {loading ? 'Creating…' : 'Create Session'}
            </button>
            {error && <p className="text-rose-400 text-sm">{error}</p>}
        </div>
    );
}

function WaitingRoom({ roomCode, connectedPlayers, onStart }) {
    const joinUrl = `${window.location.origin}${window.location.pathname}?player=1`;

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 gap-6">
            <h1 className="text-xl font-semibold text-slate-300">Session Created</h1>
            <div className="flex flex-col items-center gap-1">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Room Code</p>
                <p className="text-5xl font-bold tracking-widest text-white">{roomCode}</p>
            </div>
            <div className="w-full max-w-sm bg-slate-900 rounded-lg px-4 py-3 flex flex-col gap-1">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Players can join at</p>
                <p className="text-slate-300 text-sm break-all">{joinUrl}</p>
            </div>
            <div className="w-full max-w-sm bg-slate-900 rounded-lg px-4 py-3 flex flex-col gap-2">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Connected ({connectedPlayers.length})</p>
                {connectedPlayers.length === 0
                    ? <p className="text-slate-500 text-sm">No players yet…</p>
                    : connectedPlayers.map(p => <p key={p} className="text-slate-200 text-sm">{p}</p>)
                }
            </div>
            <button
                onClick={onStart}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium px-8 py-3 transition-colors"
            >
                Open Storyteller View
            </button>
        </div>
    );
}

export default function App() {
    const [roomCode, setRoomCode] = useState(() => sessionStorage.getItem('rk_room') ?? null);
    const [sessionReady, setSessionReady] = useState(() => !!sessionStorage.getItem('rk_room'));

    const { game, dispatch, connected, connectedPlayers } = useGameSocket(roomCode);

    const handleRoomCreated = (code) => {
        sessionStorage.setItem('rk_room', code);
        setRoomCode(code);
    };

    if (!roomCode) {
        return <Lobby onRoomCreated={handleRoomCreated} />;
    }

    if (!sessionReady) {
        return (
            <WaitingRoom
                roomCode={roomCode}
                connectedPlayers={connectedPlayers}
                onStart={() => setSessionReady(true)}
            />
        );
    }

    if (!game) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <p className="text-slate-400">{connected ? 'Loading…' : 'Connecting…'}</p>
            </div>
        );
    }

    const renderGame = () => {
        if (game.overlay === 'main') {
            switch (game.phase) {
                case 'setup':
                case 'day':
                    return <Grimoire game={game} dispatch={dispatch} />;
                case 'preGame': {
                    const players = game.players ?? [];
                    const ready = game.readyPlayers ?? [];
                    const allReady = players.length > 0 && players.every(p => ready.includes(p.name));
                    return (
                        <div className="flex flex-col gap-4">
                            <p className="text-slate-400 text-sm text-center">Waiting for players to confirm their roles…</p>
                            <div className="flex flex-col gap-2">
                                {players.map(p => (
                                    <div key={p.name} className="bg-slate-800 rounded-lg px-4 py-3 flex items-center justify-between">
                                        <span className="text-slate-200">{p.name}</span>
                                        {ready.includes(p.name)
                                            ? <span className="text-emerald-400 text-sm font-medium">Ready</span>
                                            : <span className="text-slate-500 text-sm">Waiting…</span>
                                        }
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => dispatch({ type: 'next_phase' })}
                                disabled={!allReady}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg font-medium px-4 py-2 transition-colors"
                            >
                                Begin First Night
                            </button>
                        </div>
                    );
                }
                case 'firstNight':
                case 'otherNight':
                    if (!game.actionQueue?.length) {
                        return <Grimoire game={game} dispatch={dispatch} />;
                    }
                    const bluffPool = game.script.roles.filter(
                        r => !game.players.some(p => p.role?.name === r.name)
                    );
                    return (
                        <Night
                            phase={game.phase}
                            action={game.actionQueue[0]}
                            dispatch={dispatch}
                            bluffs={game.bluffs ?? []}
                            bluffPool={bluffPool}
                            bluffsConfirmed={game.bluffsConfirmed ?? false}
                        />
                    );
            }
        }
        switch (game.overlay) {
            case 'grimoire':
                return <Grimoire game={game} dispatch={dispatch} />;
            case 'role_info':
                return <RoleInfo roles={game.script.roles} />;
            case 'script_order':
                return (
                    <ScriptOrder
                        firstNight={game.script.firstNight}
                        otherNight={game.script.otherNight}
                        roles={game.script.roles}
                    />
                );
            default:
                return <Grimoire game={game} dispatch={dispatch} />;
        }
    };

    return (
        <div className='h-screen bg-slate-950 text-white flex flex-col items-center p-6'>
            <div className='w-full max-w-2xl flex flex-col gap-4 h-full'>
                <div className='flex items-center justify-between'>
                    <span className='text-xs text-slate-500 font-mono tracking-widest w-20'>{roomCode}</span>
                    <h1 className='text-lg font-semibold text-slate-300 tracking-wide'>
                        {{ setup: 'Setup', preGame: 'Pre-Game', firstNight: 'First Night', day: 'Day', otherNight: 'Night' }[game.phase]}
                    </h1>
                    <span className='w-20 text-right text-xs text-rose-400'>{!connected ? 'disconnected' : ''}</span>
                </div>
                <div className='flex-1 overflow-y-auto'>
                    {renderGame()}
                </div>
                <div className='flex gap-2'>
                    <button className='flex-1 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors' onClick={() => dispatch({ type: 'set_overlay', overlay: 'grimoire' })}>Grimoire</button>
                    <button className='flex-1 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors' onClick={() => dispatch({ type: 'set_overlay', overlay: 'role_info' })}>Roles</button>
                    <button className='flex-1 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors' onClick={() => dispatch({ type: 'set_overlay', overlay: 'script_order' })}>Script Order</button>
                </div>
            </div>
        </div>
    );
}
