import { assert } from '../utils/helper'
import {expect, test, describe} from 'vitest'

describe('helpers', () => {
    test('assert false throws an error', () => {
        expect(() => assert(false, 'this is false')).toThrow(Error)
    })

    test('assert true returns undefined', () => {
        expect(assert(true, 'this is true')).toBe(undefined)
    })
})