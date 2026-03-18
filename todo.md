- update the script order display to indicate role type.
- consider including the role description.


- GAME FLOW
    - Setup 
        - Pick a script to play
        - Add players to the game (in seating order)
        - Future State
            - manually select roles to pull from
            - manually assign players role? 
            - arrange seating order after adding to game
    - Pre-Game
        - Show Player their role
        - future state
            - assign reminder tokens
    - First Night
        - 
    - Day Phase
    - Other Night
    - Post Game
        
- Game functions
    - Start game
    - Process Night Time
        - Component, state being turn order and stuff to display
        - progress til done, then end to go back to main page
        - allow ability to view roles info still.
    - Mark player as dead
    - REMINDER TOKENS
- UI
    - Enhance the script order display
    - Add indicator for dead player.
    - Ability to rearrange player order
        - eventually drag and drop
        - for now make up down buttons?
- BEHIND THE SCENES
    - add game objects?
    - like game.session.roles: [role] -> that are part of an active game
        - game.session.firstNight: -> specific order of roles that are in this game. 
        - NO this is determined by players as the active object, and then functions only, stop storing stuff left and right.

Open Questions
- Can I have players just learn their roles at night??
- pass phone in a circle and have them select??
- or pass in circle with pre-determined order. 