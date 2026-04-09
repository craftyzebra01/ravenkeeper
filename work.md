Update roles for reminders or triggers
default rule: if dead do not trigger

trouble brewing:
    - undertaker - reminder when someone executed
    - ravenkeeper - reminder if killed @ night
    - slayer - 1x use
    - mayor - ??? ignore for now
    - fortune teller - reminder of red herring
    - virgin - reminder when nominated the 1st time
    - drunk - actually another character - NI
    - scarlet woman - reminder if demon dead, this is demon
    - imp - reminder for any minion that they are demon

bad moon rising:
    - grandmother - reminder when child dies or reminder of who child is?
    - innkeeper - add can't die reminders, 

implement reminders separate from roles, and roles define which are active in the game
implement as add tag button? could be separate from the roles entirely?

possible reminders
- power used
- drunk
- designated character (think red herring)
- activate when killed

Implement role selection.
- screen, popup, overlay?
- how to handle the drunk or lunatic?

I should look into separating overlay from state. Have Night Phase be based on 
if things are in the action queue

Work on reviewing the changes gemini made via opencode. Additionally look into
adding game requirements to Start Game. include selectedRoles must have the 
proper count of roles to players at least, and probably to proportions. maybe
leave that out tho. legion will also make this weird. Eventually I guess add a
counter per role?
