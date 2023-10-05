import {describe, expect, test, jest} from '@jest/globals';
import axios from 'axios'
import { mocked } from 'jest-mock'


jest.mock('axios')
const _mAxios = mocked(axios)
const mAxios = axios as jest.Mocked<typeof axios>

describe('Jest mock test', function TestJest() {
    test.skip("Should mock a function", function TestFunctionMock() {
        const mockFn = jest.fn()
        mockFn.mockReturnValue(3)

        expect(mockFn()).toEqual(3)
    })

    test.only("Should mock axios get", async function TestAxios() {
        const shouldBe = { 
            who: 'jake'
        }
        mAxios.get.mockResolvedValue(shouldBe)

        const resp = await mAxios.get('https://jsonplaceholder.typicode.com/todos/1')
        
        expect(resp).toEqual(shouldBe)
    })

    test.only("Should mock without typecasting", async function TestNoTypeMock() {
        const shouldBe = {
            who: 'jake'
        }

        _mAxios.get.mockResolvedValue(shouldBe)
        const resolved = await _mAxios.get("https://jsonplaceholder.typicode.com/todos/1")
        expect(resolved).toEqual(shouldBe)
    })
});