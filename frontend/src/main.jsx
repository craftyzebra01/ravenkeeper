import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PlayerView from './pages/PlayerView.jsx'

function Landing({ onStoryteller, onPlayer }) {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 gap-8">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-3xl font-bold text-slate-100">Ravenkeeper</h1>
                <p className="text-slate-400 text-sm">Blood on the Clocktower</p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                    onClick={onStoryteller}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium px-4 py-3 transition-colors"
                >
                    I'm the Storyteller
                </button>
                <button
                    onClick={onPlayer}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium px-4 py-3 transition-colors"
                >
                    Join a Game
                </button>
            </div>
        </div>
    );
}

function Root() {
    const [view, setView] = useState(() => {
        if (window.location.pathname.startsWith('/join')) return 'player';
        if (sessionStorage.getItem('rk_room')) return 'storyteller';
        if (sessionStorage.getItem('rk_player_room')) return 'player';
        return 'landing';
    });

    if (view === 'landing') {
        return <Landing onStoryteller={() => setView('storyteller')} onPlayer={() => setView('player')} />;
    }
    if (view === 'player') {
        return <PlayerView />;
    }
    return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
