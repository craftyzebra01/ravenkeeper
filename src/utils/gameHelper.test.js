import { assignRoles, isBetween } from './gameHelper';
import {expect, test, describe} from 'vitest';

const playersFive = [
    { 'name': 'a' },
    { 'name': 'b' },
    { 'name': 'c' },
    { 'name': 'd' },
    { 'name': 'e' },
]

const tbRoles = [
    {
        "role": "Washerwoman",
        "description": "You start knowing that 1 of 2 players is a particular Townsfolk.",
        "type": "townsfolk"
    },
    {
        "role": "Librarian",
        "description": "You start knowing that 1 of 2 players is a particular Outsider.(Or that zero are in play.)",
        "type": "townsfolk"
    },
    {
        "role": "Investigator",
        "description": "You start knowing that 1 of 2 players is a particular Minion.",
        "type": "townsfolk"
    },
    {
        "role": "Chef",
        "description": "You start knowing how many pairs of evil players there are.",
        "type": "townsfolk"
    },
    {
        "role": "Empath",
        "description": "Each night, you learn how many of your 2 alive neighbors are evil.",
        "type": "townsfolk"
    },
    {
        "role": "Fortune Teller",
        "description": "Each night, choose 2 players: you learn if either is a Demon. There is a good player that registers as a Demon to you",
        "type": "townsfolk"
    },
    {
        "role": "Undertaker",
        "description": "Each night*, you learn which character died by execution today.",
        "type": "townsfolk"
    },
    {
        "role": "Monk",
        "description": "Each night*, choose a player(not yourself): they are safe from the Demon tonight.",
        "type": "townsfolk"
    },
    {
        "role": "Ravenkeeper",
        "description": "If you die at night, you are woken to choose a player: you learn their character.",
        "type": "townsfolk"
    },
    {
        "role": "Virgin",
        "description": "The 1st time you are nominated, if the nominator is a Townsflk, they are executed immediately.",
        "type": "townsfolk"
    },
    {
        "role": "Slayer",
        "description": "Once per game, during the day, publicly choose a player: if they are the Demon, they die.",
        "type": "townsfolk"
    },
    {
        "role": "Soldier",
        "description": "You are safe from the Demon.",
        "type": "townsfolk"
    },
    {
        "role": "Mayor",
        "description": "If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.",
        "type": "townsfolk"
    },
    {
        "role": "Butler",
        "description": "Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too.",
        "type": "outsider"
    },
    {
        "role": "Drunk",
        "description": "You do not know you are the Drunk. You think you are a Townfolk character, but you are not.",
        "type": "outsider"
    },
    {
        "role": "Recluse",
        "description": "You might register as evil & as a Minion or Demon, even if dead,",
        "type": "outsider"
    },
    {
        "role": "Saint",
        "description": "If you die by execution, your team loses.",
        "type": "outsider"
    },
    {
        "role": "Poisoner",
        "description": "Each night, choose a player: they are poisoned tonight and tomorrow day.",
        "type": "minion"
    },
    {
        "role": "Spy",
        "description": "Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.",
        "type": "minion"
    },
    {
        "role": "Baron",
        "description": "There are extra Outsiders in play. [+2 Outsiders]",
        "type": "minion"
    },
    {
        "role": "Scarlet Woman",
        "description": "If there are 5 or more players alive & the Demon dies, you become the Demon. (Travellers don't count.)",
        "type": "minion"
    },
    {
        "role": "Imp",
        "description": "Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.",
        "type": "demon"
    }
]

// 'describe' groups related tests
describe('gameHelpers', () => {
    test('5 players has 3,0,1,1 roles.', () => {

        const players = assignRoles(playersFive, tbRoles);

        expect(players.filter(p => p.role.type === 'townsfolk').length).toBe(3);
        expect(players.filter(p => p.role.type === 'minion').length).toBe(1);
        expect(players.filter(p => p.role.type === 'demon').length).toBe(1);
    });

    test('Players length not in 5-15 throws an error.', () => {
        expect(() => assignRoles([], tbRoles)).toThrow(RangeError);
    });

    test('5 is between 5-15', () => {
        expect(isBetween(5, 5, 15)).toBeTruthy();
    });

    test('4 is not between 5-15', () => {
        expect(isBetween(4, 5, 15)).toBeFalsy();
    });

});