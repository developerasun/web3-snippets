import {describe, expect, test, jest} from '@jest/globals';

describe('Jest mock test', function TestJest() {
    test.only("Should mock a function", function TestFunctionMock() {
        const mockFn = jest.fn()
        mockFn.mockReturnValue(3)

        expect(mockFn()).toEqual(3)
    })
});