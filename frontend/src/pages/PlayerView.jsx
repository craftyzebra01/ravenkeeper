import React, { useState, useEffect, useRef } from 'react';

const WS_BASE = import.meta.env.VITE_WS_URL ?? `ws://${window.location.hostname}:8000`;
const API_BASE = import.meta.env.VITE_API_URL ?? `http://${window.location.hostname}:8000`;

const teamBg = {
    townsfolk: 'bg-blue-700',
    outsider: 'bg-blue-800',
    minion: 'bg-red-800',
    demon: 'bg-red-950',
};

function connect(code, playerName, { onMessage, onOpen, onClose }) {
    const ws = new WebSocket(`${WS_BASE}/ws/${code}/player/${encodeURIComponent(playerName)}`);
    ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        onMessage(msg);
    };
    ws.onopen = onOpen;
    ws.onclose = onClose;
    return ws;
}

export default function PlayerView() {
    const [stage, setStage] = useState('join');
    const [roomCode, setRoomCode] = useState(() => sessionStorage.getItem('rk_player_room') ?? '');
    const [name, setName] = useState(() => sessionStorage.getItem('rk_player_name') ?? '');
    const [error, setError] = useState('');
    const [message, setMessage] = useState(null);
    const [players, setPlayers] = useState([]);
    const wsRef = useRef(null);

    const openSocket = (code, playerName) => {
        wsRef.current?.close();
        const ws = connect(code, playerName, {
            onMessage: (msg) => {
                if (msg.type === 'player_list') setPlayers(msg.players);
                else setMessage(msg);
            },
            onOpen: () => setStage('lobby'),
            onClose: () => setError('Disconnected from server'),
        });
        wsRef.current = ws;
    };

    // Auto-reconnect on refresh if session was saved
    useEffect(() => {
        const savedCode = sessionStorage.getItem('rk_player_room');
        const savedName = sessionStorage.getItem('rk_player_name');
        if (savedCode && savedName) {
            openSocket(savedCode, savedName);
        }
    }, []);

    const handleJoin = async (e) => {
        e.preventDefault();
        setError('');
        const code = roomCode.trim().toUpperCase();
        const playerName = name.trim();
        if (!code || !playerName) return;

        try {
            const res = await fetch(`${API_BASE}/rooms/${code}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: playerName }),
            });
            if (!res.ok) {
                const d = await res.json();
                setError(d.detail ?? 'Failed to join room');
                return;
            }
        } catch {
            setError('Could not reach server');
            return;
        }

        sessionStorage.setItem('rk_player_room', code);
        sessionStorage.setItem('rk_player_name', playerName);
        openSocket(code, playerName);
    };

    const sendReady = () => {
        wsRef.current?.send(JSON.stringify({ type: 'player_ready' }));
    };

    useEffect(() => () => wsRef.current?.close(), []);

    if (stage === 'join') {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-sm flex flex-col gap-4">
                    <h1 className="text-2xl font-bold text-center text-slate-100">Join Game</h1>
                    <form onSubmit={handleJoin} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-400 font-medium uppercase tracking-wide">Room Code</label>
                            <input
                                className="bg-slate-800 text-white rounded-lg px-4 py-2 uppercase tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={roomCode}
                                onChange={e => setRoomCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                autoComplete="off"
                                placeholder="XXXXXX"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-400 font-medium uppercase tracking-wide">Your Name</label>
                            <input
                                className="bg-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Enter your name"
                                autoComplete="off"
                            />
                        </div>
                        {error && <p className="text-rose-400 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium px-4 py-2 transition-colors"
                        >
                            Join
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (!message || message.type === 'waiting_lobby') {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 gap-4">
                <h1 className="text-xl font-semibold text-slate-300">Waiting for the game to start…</h1>
                <div className="w-full max-w-sm bg-slate-900 rounded-lg px-4 py-3 flex flex-col gap-2">
                    {(message?.players ?? players).map(p => (
                        <div key={p} className="text-slate-200 text-sm">{p}</div>
                    ))}
                </div>
                {error && <p className="text-rose-400 text-sm">{error}</p>}
            </div>
        );
    }

    if (message.type === 'pre_game_waiting') {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
                <p className="text-xl font-semibold text-slate-400">Waiting for everyone to confirm…</p>
            </div>
        );
    }

    if (message.type === 'role_reveal') {
        const role = message.role;
        const bg = teamBg[role?.team] ?? 'bg-slate-800';
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 gap-6">
                <h1 className="text-xl font-semibold text-slate-300">Your Role</h1>
                <div className={`${bg} rounded-xl px-8 py-6 w-full max-w-sm flex flex-col gap-2 items-center`}>
                    <span className="text-2xl font-bold">{role?.name}</span>
                    <span className="text-xs uppercase tracking-wide text-white/70">{role?.team}</span>
                    <p className="text-sm text-white/90 text-center mt-2">{role?.ability}</p>
                </div>
                <button
                    onClick={sendReady}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium px-8 py-3 transition-colors"
                >
                    Got it
                </button>
            </div>
        );
    }

    if (message.type === 'night_prompt') {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 gap-6">
                <h1 className="text-lg font-semibold text-slate-400 uppercase tracking-wide">{message.role_name}</h1>
                <div className="bg-slate-900 rounded-xl px-8 py-6 w-full max-w-sm text-center text-white text-lg font-medium">
                    {message.message}
                </div>
            </div>
        );
    }

    if (message.type === 'night_waiting') {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
                <p className="text-2xl font-semibold text-slate-400">Keep your eyes closed.</p>
            </div>
        );
    }

    if (message.type === 'phase_change' && message.phase === 'day') {
        const role = message.role;
        const bg = teamBg[role?.team] ?? 'bg-slate-800';
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 gap-4">
                <p className="text-xl font-semibold text-amber-400">Day Phase</p>
                {role && (
                    <div className={`${bg} rounded-xl px-6 py-4 w-full max-w-sm flex flex-col gap-1 items-center`}>
                        <span className="text-lg font-bold">{role.name}</span>
                        <span className="text-xs uppercase tracking-wide text-white/70">{role.team}</span>
                        <p className="text-sm text-white/80 text-center mt-1">{role.ability}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
            <p className="text-slate-400">Waiting…</p>
        </div>
    );
}
