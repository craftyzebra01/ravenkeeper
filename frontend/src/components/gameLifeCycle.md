# Game object lifecycle

## Properties
scriptName -> The friendly name of the script in the drop down selector.
scriptRoles
players -> List of Players.
scriptRoles -> List of Roles
    - on script load
phase -> str (setup, )

Role
- name
- description (ability and other additions)
- type (townfolk, outsider, minion, demon)

## Events
- onAddPlayer
    - add an addition >= 5 then randomly assign roles each time
- onScriptChange
    - update script related properties x
    - load available roles into game.scriptRoles x
    - load selected script friendly name into game.scriptName x
    - unassign roles from current players (or allow it to assign roles automatically)
- onTransitionClick
    - setup -> first_night -> (day, other_night).* -> post_game

## UI Elements
- Phase transition button
- How should the player card look?
    - what do i need to display?
        - Player Name
        - Role Name
        - Easy Team Indicator (background color? role name color?, label?)

### Access Patterns
Get roles by type
    - from available roles
    - from players
        - game.roles.players.filter(p =>)
Night order
Change phase

### Schemas:
scripts.json
- name: str
- roles: [role]
- firstNight: [str]
- otherNight: [str]