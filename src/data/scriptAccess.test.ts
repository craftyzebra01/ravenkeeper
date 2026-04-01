import { getScripts } from './scriptAccess.js'
import { expect, test, describe } from 'vitest'
import troubleBrewing from './scripts/trouble_brewing.json' with { type: 'json' }
import badMoonRising from './scripts/bad_moon_rising.json' with { type: 'json' }

describe('getScripts', () => {
    test('returns an array', () => {
        expect(Array.isArray(getScripts())).toBe(true)
    })

    test('each script has name, firstNight, otherNight, and roles', () => {
        for (const script of getScripts()) {
            expect(script).toHaveProperty('name')
            expect(script).toHaveProperty('firstNight')
            expect(script).toHaveProperty('otherNight')
            expect(script).toHaveProperty('roles')
        }
    })

    test('script name is copied from the source script', () => {
        const scripts = getScripts()
        const tb = scripts.find(s => s.name === 'Trouble Brewing')
        expect(tb?.name).toBe(troubleBrewing.name)
    })

    test('firstNight is copied from the source script', () => {
        const scripts = getScripts()
        const tb = scripts.find(s => s.name === 'Trouble Brewing')
        expect(tb?.firstNight).toEqual(troubleBrewing.firstNight)
    })

    test('otherNight is copied from the source script', () => {
        const scripts = getScripts()
        const tb = scripts.find(s => s.name === 'Trouble Brewing')
        expect(tb?.otherNight).toEqual(troubleBrewing.otherNight)
    })

    test('roles is an array of role objects, not strings', () => {
        for (const script of getScripts()) {
            for (const role of script.roles) {
                expect(typeof role).toBe('object')
                expect(typeof role.name).toBe('string')
                expect(typeof role.ability).toBe('string')
                expect(typeof role.team).toBe('string')
            }
        }
    })

    test('roles are mapped from the master roles list by name', () => {
        const scripts = getScripts()
        const tb = scripts.find(s => s.name === 'Trouble Brewing')
        const washerwoman = tb?.roles.find(r => r.name === 'Washerwoman')
        expect(washerwoman).toBeDefined()
        expect(washerwoman?.ability).toBe('You start knowing that 1 of 2 players is a particular Townsfolk.')
        expect(washerwoman?.team).toBe('townsfolk')
    })

    test('roles count matches the source script roles list', () => {
        const scripts = getScripts()
        const tb = scripts.find(s => s.name === 'Trouble Brewing')
        expect(tb?.roles.length).toBe(troubleBrewing.roles.length)
        const bmr = scripts.find(s => s.name === 'Bad Moon Rising')
        expect(bmr?.roles.length).toBe(badMoonRising.roles.length)
    })

    test('roles with firstNight/otherNight fields are mapped correctly', () => {
        const scripts = getScripts()
        const bmr = scripts.find(s => s.name === 'Bad Moon Rising')
        const grandmother = bmr?.roles.find(r => r.name === 'Grandmother')
        expect(grandmother).toBeDefined()
        expect(grandmother).toHaveProperty('firstNight')
        expect(grandmother).toHaveProperty('otherNight')
        expect(grandmother).not.toHaveProperty('night')
    })

    test('roles with a night field are mapped correctly', () => {
        const scripts = getScripts()
        const tb = scripts.find(s => s.name === 'Trouble Brewing')
        const imp = tb?.roles.find(r => r.name === 'Imp')
        expect(imp).toBeDefined()
        expect(imp).toHaveProperty('night')
        expect(imp).not.toHaveProperty('firstNight')
        expect(imp).not.toHaveProperty('otherNight')
    })
})
