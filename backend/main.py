from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from game.sessions import room_manager
from game.logic import game_reducer, get_initial_game, get_player_message

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# HTTP endpoints
# ---------------------------------------------------------------------------

@app.post("/rooms")
async def create_room():
    code = room_manager.create_room()
    room = room_manager.get_room(code)
    room.game_state = get_initial_game()
    return {"room_code": code}


@app.get("/rooms/{code}")
async def get_room(code: str):
    room = room_manager.get_room(code)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return {
        "room_code": room.room_code,
        "players": list(room.players.keys()),
        "player_count": len(room.players),
    }


@app.post("/rooms/{code}/join")
async def join_room(code: str, body: dict):
    room = room_manager.get_room(code)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    name = body.get("name", "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Name is required")
    return {"ok": True, "room_code": room.room_code}


# ---------------------------------------------------------------------------
# WebSocket — storyteller
# ---------------------------------------------------------------------------

@app.websocket("/ws/{code}/storyteller")
async def storyteller_ws(websocket: WebSocket, code: str):
    room = room_manager.get_room(code)
    if not room:
        await websocket.close(code=4004, reason="Room not found")
        return

    await websocket.accept()
    room.storyteller_ws = websocket

    # Send current state immediately
    await websocket.send_json({"type": "state_update", "state": room.game_state})

    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "action":
                action = data.get("action", {})
                try:
                    room.game_state = game_reducer(room.game_state, action)
                except Exception as e:
                    await websocket.send_json({"type": "error", "message": str(e)})
                    continue

                # Push full state back to storyteller
                await websocket.send_json({"type": "state_update", "state": room.game_state})

                # Push targeted messages to all players
                await room.push_all_player_states()

                # Notify players of player list changes
                if action.get("type") in ("add_player", "del_player", "move_player"):
                    player_list = [p["name"] for p in room.game_state.get("players", [])]
                    await room.broadcast_players({"type": "player_list", "players": player_list})

    except WebSocketDisconnect:
        room.storyteller_ws = None


# ---------------------------------------------------------------------------
# WebSocket — player
# ---------------------------------------------------------------------------

@app.websocket("/ws/{code}/player/{name}")
async def player_ws(websocket: WebSocket, code: str, name: str):
    room = room_manager.get_room(code)
    if not room:
        await websocket.close(code=4004, reason="Room not found")
        return

    await websocket.accept()
    room.players[name] = websocket

    # Auto-add player to game state if not already present and game is still in setup
    already_in_game = any(p["name"] == name for p in room.game_state.get("players", []))
    if not already_in_game and room.game_state.get("phase") == "setup":
        room.game_state = game_reducer(room.game_state, {"type": "add_player", "playerName": name})
        await room.send_storyteller({"type": "state_update", "state": room.game_state})

    # Send current state for this player immediately
    await room.push_player_state(name)

    # Notify storyteller a player joined
    await room.send_storyteller({
        "type": "player_joined",
        "name": name,
        "connected_players": list(room.players.keys()),
    })

    try:
        while True:
            data = await websocket.receive_json()
            # Players can only send player_ready acknowledgements
            if data.get("type") == "player_ready":
                room.game_state = game_reducer(room.game_state, {"type": "player_ready", "playerName": name})
                await room.push_player_state(name)
                await room.send_storyteller({"type": "state_update", "state": room.game_state})

    except WebSocketDisconnect:
        room.players.pop(name, None)
        await room.send_storyteller({
            "type": "player_left",
            "name": name,
            "connected_players": list(room.players.keys()),
        })
