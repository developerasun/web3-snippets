import {describe, expect, test, jest} from '@jest/globals';
import axios from 'axios'

jest.mock('axios')

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
});