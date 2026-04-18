import secrets
import string
from fastapi import WebSocket


def _generate_room_code(length: int = 6) -> str:
    chars = string.ascii_uppercase + string.digits
    for ch in ('0', '1', 'I', 'O', 'L'):
        chars = chars.replace(ch, '')
    return ''.join(secrets.choice(chars) for _ in range(length))


class GameSession:
    def __init__(self, room_code: str):
        self.room_code = room_code
        self.storyteller_ws: WebSocket | None = None
        self.players: dict[str, WebSocket] = {}   # player_name → WebSocket
        self.game_state: dict = {}

    async def send_storyteller(self, message: dict):
        if self.storyteller_ws:
            try:
                await self.storyteller_ws.send_json(message)
            except Exception:
                self.storyteller_ws = None

    async def send_player(self, player_name: str, message: dict):
        ws = self.players.get(player_name)
        if ws:
            try:
                await ws.send_json(message)
            except Exception:
                self.players.pop(player_name, None)

    async def broadcast_players(self, message: dict):
        disconnected = []
        for name, ws in self.players.items():
            try:
                await ws.send_json(message)
            except Exception:
                disconnected.append(name)
        for name in disconnected:
            self.players.pop(name, None)

    async def push_player_state(self, player_name: str):
        """Derive and push the current relevant message to one player."""
        from game.logic import get_player_message
        msg = get_player_message(self.game_state, player_name)
        await self.send_player(player_name, msg)

    async def push_all_player_states(self):
        for name in list(self.players.keys()):
            await self.push_player_state(name)


class RoomManager:
    def __init__(self):
        self._rooms: dict[str, GameSession] = {}

    def create_room(self) -> str:
        for _ in range(10):
            code = _generate_room_code()
            if code not in self._rooms:
                self._rooms[code] = GameSession(code)
                return code
        raise RuntimeError("Could not generate unique room code")

    def get_room(self, code: str) -> GameSession | None:
        return self._rooms.get(code.upper())

    def delete_room(self, code: str):
        self._rooms.pop(code, None)


room_manager = RoomManager()
