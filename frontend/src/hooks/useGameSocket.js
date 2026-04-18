import { useState, useEffect, useRef, useCallback } from 'react';

const WS_BASE = import.meta.env.VITE_WS_URL ?? `ws://${window.location.hostname}:8000`;
const API_BASE = import.meta.env.VITE_API_URL ?? `http://${window.location.hostname}:8000`;

export function useGameSocket(roomCode) {
    const [game, setGame] = useState(null);
    const [connected, setConnected] = useState(false);
    const [connectedPlayers, setConnectedPlayers] = useState([]);
    const wsRef = useRef(null);

    useEffect(() => {
        if (!roomCode) return;
        const ws = new WebSocket(`${WS_BASE}/ws/${roomCode}/storyteller`);
        wsRef.current = ws;

        ws.onopen = () => setConnected(true);
        ws.onclose = () => setConnected(false);
        ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            if (msg.type === 'state_update') setGame(msg.state);
            else if (msg.type === 'player_joined' || msg.type === 'player_left')
                setConnectedPlayers(msg.connected_players ?? []);
        };

        return () => ws.close();
    }, [roomCode]);

    const dispatch = useCallback((action) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'action', action }));
        }
    }, []);

    return { game, dispatch, connected, connectedPlayers };
}

export async function createRoom() {
    const res = await fetch(`${API_BASE}/rooms`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to create room');
    const data = await res.json();
    return data.room_code;
}
