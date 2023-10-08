import { logger, useCron, useInterval, useTerm } from '@scripts/hook';
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

    it.skip("Should log when terminal ended", function TestSignalHangUp() {
        useTerm()

        setTimeout(function() {
            console.log('Exiting.');
            // process.exit(0);
            process.kill(process.pid, 'SIGINT'); // on windows, use SIGINT instead of SIGHUP
          }, 3000);
    })

    it.skip("should log in two seconds", function TestLogInTwoSeconds() {
        setTimeout(() => {
            console.log("Wefwef")
        }, 2000);
    })

    it.only("Should check promise orders", async function TestPromiseOrder() {
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
})