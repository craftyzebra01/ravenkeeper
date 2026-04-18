import json
import random
import copy
from pathlib import Path

_DATA_DIR = Path(__file__).parent.parent / "data"

# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def _load_roles() -> list[dict]:
    with open(_DATA_DIR / "roles.json") as f:
        return json.load(f)

def _load_scripts() -> list[dict]:
    all_roles = {r["name"]: r for r in _load_roles()}
    script_files = ["trouble_brewing.json", "bad_moon_rising.json", "sects_and_violets.json"]
    scripts = []
    for fname in script_files:
        with open(_DATA_DIR / "scripts" / fname) as f:
            raw = json.load(f)
        scripts.append({
            "name": raw["name"],
            "firstNight": raw["firstNight"],
            "otherNight": raw["otherNight"],
            "roles": [all_roles[n] for n in raw["roles"] if n in all_roles],
        })
    return scripts

_SCRIPTS = _load_scripts()

def get_scripts() -> list[dict]:
    return _SCRIPTS


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_SPECIAL_ACTIONS = [
    {"name": "Minion Info", "vm": "Wake up the minion(s) and point to the demon."},
    {"name": "Demon Info",  "vm": "Wake up the demon and point to the minion(s)."},
    {"name": "Dusk",        "vm": "The night has begun."},
    {"name": "Dawn",        "vm": "Day shines once more."},
]
_SPECIAL_NAMES = {a["name"] for a in _SPECIAL_ACTIONS}


def shuffle(lst: list) -> list:
    result = list(lst)
    random.shuffle(result)
    return result


def _create_pregame_actions(players: list[dict]) -> list[dict]:
    actions = [
        {
            "playerName": p["name"],
            "visibleMessage": "",
            "hiddenMessage": f"{p['role']['name']} - {p['role']['team']} {p['role']['ability']}",
            "role": p["role"],
        }
        for p in players
    ]
    actions.append({"name": "Begin First Night", "visibleMessage": "All players have seen their roles. Begin the first night."})
    return actions


def _create_night_actions(players: list[dict], night: list[str]) -> list[dict]:
    sa_map = {a["name"]: a for a in _SPECIAL_ACTIONS}
    actions = []
    for entry in night:
        if entry in sa_map:
            sa = sa_map[entry]
            actions.append({"name": sa["name"], "visibleMessage": sa["vm"]})
            continue
        player = next((p for p in players if p.get("role", {}).get("name") == entry), None)
        if player:
            role = player["role"]
            dead = player.get("dead", False)
            acts_when_dead = role.get("actsWhenDead", False)
            one_time = role.get("oneTimeDeadAbility", False)
            dead_ability_used = player.get("deadAbilityUsed", False)
            should_act = not dead or acts_when_dead or (one_time and not dead_ability_used)
            if should_act:
                action = dict(player)
                action["visibleMessage"] = f"{role['name']} {role['ability']}"
                actions.append(action)
    return actions


def _randomly_assign_roles(players: list[dict], roles: list[dict]) -> list[dict]:
    if len(players) != len(roles):
        raise ValueError("players and roles must be the same length")
    locked = [p for p in players if p.get("assignedRole")]
    locked_names = {p["assignedRole"]["name"] for p in locked}
    remaining = shuffle([r for r in roles if r["name"] not in locked_names])
    result = []
    i = 0
    for p in players:
        player = dict(p)
        if player.get("assignedRole"):
            player["role"] = player.pop("assignedRole")
        else:
            player.pop("assignedRole", None)
            player["role"] = remaining[i]
            i += 1
        result.append(player)
    return result


def get_initial_game() -> dict:
    scripts = get_scripts()
    return {
        "phase": "setup",
        "overlay": "main",
        "players": [],
        "script": scripts[0],
        "roles": scripts[0]["roles"],
        "actionQueue": [],
        "selectedRoles": [],
        "bluffs": [],
        "bluffsConfirmed": False,
        "readyPlayers": [],
    }


# ---------------------------------------------------------------------------
# Reducer
# ---------------------------------------------------------------------------

def game_reducer(game: dict, action: dict) -> dict:
    t = action.get("type")
    g = copy.deepcopy(game)

    if t == "add_role":
        g["selectedRoles"].append(action["role"])

    elif t == "del_role":
        role_name = action["role"]
        g["selectedRoles"] = [r for r in g["selectedRoles"] if r["name"] != role_name]
        for p in g["players"]:
            if p.get("assignedRole", {}) and p["assignedRole"].get("name") == role_name:
                p["assignedRole"] = None

    elif t == "set_script":
        script = next((s for s in get_scripts() if s["name"] == action["scriptName"]), game["script"])
        g["script"] = script
        g["roles"] = script["roles"]
        g["selectedRoles"] = []
        g["bluffs"] = []
        g["bluffsConfirmed"] = False
        for p in g["players"]:
            p["assignedRole"] = None

    elif t == "set_player_role":
        for p in g["players"]:
            if p["name"] == action["playerName"]:
                p["assignedRole"] = action.get("role")

    elif t == "set_overlay":
        g["overlay"] = "main" if action["overlay"] == game.get("overlay") else action["overlay"]

    elif t == "del_player":
        g["players"] = [p for p in g["players"] if p["name"] != action["playerName"]]

    elif t == "add_player":
        g["players"].append({"name": action["playerName"], "dead": False, "tags": []})

    elif t == "assign_roles":
        g["players"] = _randomly_assign_roles(g["players"], g["selectedRoles"])

    elif t == "player_ready":
        ready = g.get("readyPlayers", [])
        if action["playerName"] not in ready:
            g["readyPlayers"] = ready + [action["playerName"]]

    elif t == "next_phase":
        phase = game["phase"]
        if phase == "setup":
            players = _randomly_assign_roles(g["players"], g["selectedRoles"])
            g["phase"] = "preGame"
            g["players"] = players
            g["overlay"] = "main"
            g["actionQueue"] = []
            g["readyPlayers"] = []
        elif phase == "preGame":
            g["phase"] = "firstNight"
            g["overlay"] = "main"
            g["actionQueue"] = _create_night_actions(g["players"], g["script"]["firstNight"])
        elif phase == "day":
            g["phase"] = "otherNight"
            g["actionQueue"] = _create_night_actions(g["players"], g["script"]["otherNight"])
        elif phase == "otherNight":
            g["phase"] = "day"
        elif phase == "firstNight":
            g["phase"] = "day"

    elif t == "move_player":
        players = g["players"]
        i = next((idx for idx, p in enumerate(players) if p["name"] == action["playerName"]), -1)
        j = i - 1 if action["direction"] == "up" else i + 1
        if 0 <= i < len(players) and 0 <= j < len(players):
            players[i], players[j] = players[j], players[i]

    elif t == "reset_game":
        g = get_initial_game()

    elif t == "toggle_bluff":
        if g.get("bluffsConfirmed"):
            return game
        bluffs = g.get("bluffs", [])
        role = action["role"]
        if any(b["name"] == role["name"] for b in bluffs):
            g["bluffs"] = [b for b in bluffs if b["name"] != role["name"]]
        elif len(bluffs) < 3:
            g["bluffs"] = bluffs + [role]

    elif t == "toggle_player_status":
        status = action["status"]
        for p in g["players"]:
            if p["name"] == action["playerName"]:
                p[status] = not p.get(status, False)

    elif t == "confirm_bluffs":
        bluff_tags = [f"Bluff: {b['name']}" for b in g.get("bluffs", [])]
        for p in g["players"]:
            if p.get("role", {}).get("team") == "demon":
                p["tags"] = p.get("tags", []) + bluff_tags
        g["bluffsConfirmed"] = True

    elif t == "next_action":
        queue = g.get("actionQueue", [])
        if queue:
            current = queue[0]
            role = current.get("role", {}) or {}
            if role.get("oneTimeDeadAbility") and current.get("name"):
                for p in g["players"]:
                    if p["name"] == current["name"]:
                        p["deadAbilityUsed"] = True
            g["actionQueue"] = queue[1:]

    elif t == "mark_dead":
        for p in g["players"]:
            if p["name"] == action["playerName"]:
                p["dead"] = True

    elif t == "use_dead_vote":
        for p in g["players"]:
            if p["name"] == action["playerName"]:
                if not p.get("dead"):
                    raise ValueError(f"use_dead_vote - player {action['playerName']} is not dead")
                if p.get("deadVoteUsed"):
                    raise ValueError(f"use_dead_vote - player {action['playerName']} already used dead vote")
                p["deadVoteUsed"] = True

    elif t == "add_tag":
        for p in g["players"]:
            if p["name"] == action["playerName"]:
                p["tags"] = p.get("tags", []) + [action["tag"]]

    elif t == "remove_tag":
        for p in g["players"]:
            if p["name"] == action["playerName"]:
                tags = p.get("tags", [])
                p["tags"] = [tag for i, tag in enumerate(tags) if i != action["index"]]

    return g


# ---------------------------------------------------------------------------
# Player message derivation
# ---------------------------------------------------------------------------

def get_player_message(game_state: dict, player_name: str) -> dict:
    """Derive the current message to push to a specific player."""
    phase = game_state.get("phase")
    player = next((p for p in game_state.get("players", []) if p["name"] == player_name), None)

    if phase == "setup":
        return {"type": "waiting_lobby", "players": [p["name"] for p in game_state.get("players", [])]}

    if phase == "preGame" and player:
        if player_name in game_state.get("readyPlayers", []):
            return {"type": "pre_game_waiting"}
        role = player.get("role")
        if role:
            return {"type": "role_reveal", "role": role}
        return {"type": "waiting_lobby", "players": [p["name"] for p in game_state.get("players", [])]}

    queue = game_state.get("actionQueue", [])
    current = queue[0] if queue else None

    if phase in ("firstNight", "otherNight"):
        if current and current.get("playerName") == player_name:
            return {
                "type": "night_prompt",
                "message": current.get("visibleMessage", ""),
                "role_name": current.get("role", {}).get("name", "") if current.get("role") else "",
            }
        return {"type": "night_waiting"}

    if phase == "day":
        role = player.get("role") if player else None
        return {"type": "phase_change", "phase": "day", "role": role}

    return {"type": "waiting_lobby", "players": [p["name"] for p in game_state.get("players", [])]}
