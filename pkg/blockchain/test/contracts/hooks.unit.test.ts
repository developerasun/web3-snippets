import { logger, useCron, useEpochTime, useInterval } from '@scripts/hook';
import { expect } from 'chai';

const PREFIX="hooks"

describe(`${PREFIX}-utility-hooks`, function TestHookFunctions() {
    it.skip("Should execute cron jobs every 1 mins", async function TestCron() {
        const callback = () => console.log("check")
        const everyOneMinute = "*/1 * * * *" 
        useCron(everyOneMinute, callback)
    })   
  
    it.skip("Should execute cron jobs by 2 secs", async function TestInterval() {
        const handler = () => console.log("now: ", Date.now())
        const params = {
            timeout: 2000, 
            clear: 6000 
        } 

        const {done} = await useInterval(handler, params.timeout, params.clear)
        
        expect(done).to.be.true
    }) 

    it.skip("should log in two seconds", function TestLogInTwoSeconds() {
        setTimeout(() => {
            console.log("Wefwef")
        }, 2000);
    })

    it.skip("Should check promise orders", async function TestPromiseOrder() {
        let success: number[] = []

        let retryAt: number = 999

        async function pLog(index: number) {
            return await new Promise((resolve, reject) => {
                console.log(index)

                if (index !== 8) { // escape at index 8
                    success.push(index)
                    resolve(true)
                } else {
                    reject(false)
                }
            })
        }
 
        try {
            for (let index = 0; index < 10; index++) {
                await pLog(index) // sequential execution 
            }  
        } catch (error) {   
            console.error(error)
        } finally {   
            console.log("done")
            console.log(success)
            console.log("success till index: ", success.length-1)
            console.log("Failed at index: ", success.length)
            retryAt = success.length
        } 

        console.log("next promise execution index at: ", retryAt)
    })

    it.skip("Should log epoch time in seconds", function TestEpochTime() {
        const {utc, local} = useEpochTime()

        console.log({utc})
        console.log({local})
    })
})

describe(`${PREFIX}-OOP`, function TestObjectOriented() {
    it.only("Should return different values with generics", function TestGeneric() {
        function returnValue<T>(name: T): T {
            return name
        }

        expect(returnValue<number>(3)).to.equal(3)

        const target = { name: 'Jake' }
        expect(returnValue(target)).to.equal(target)
    })

    it.only("Should make different function signature", function TestOverloading() {
        // overload signature
        function greetings(name: string): string;
        function greetings(age: number): number

        // overload implementation
        function greetings(arg: string | number) {
            return arg
        }

        expect(greetings('jake')).to.equal('jake')
        expect(greetings(29)).to.equal(29)
    })

    it.only("Should implement an interface", function TestImplementation() {
        interface greetings {
            sayHi: () => string
        }

        class Hello implements greetings {
            private _name: string

            constructor(name: string) {
                this._name = name
            }

            sayHi() {
                return this._name
            }
        }

        const hello = new Hello('jake')
        expect( hello.sayHi()).to.equal('jake')
    })
})