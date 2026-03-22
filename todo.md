## NEXT UP
- clean up the night -> day transitions in the ui.
- menu button
    - reset button in here
    - script selection
- game over screen
- make the last action of Night the next phase button 
    rather than another separate screen after that? 
    Maybe keep for preGame since the others have 'Day' 
    as the last action.
- persist game state so refreshing doesn't lose it.
- add tailwind styling
    - installation complete.


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
- Add help text or tooltips?
    - like washerwoman (flip to the grimoire, point to a role, point to 2 people)?