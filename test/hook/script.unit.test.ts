import { logger, useCron, useInterval } from '@scripts/hook';
import { expect } from 'chai';

const PREFIX="scripts"

describe(`${PREFIX}-utility-hooks`, function TestHookFunctions() {
    it.skip("Should execute cron jobs every 1 mins", async function TestCron() {
        const callback = () => console.log("check")
        const everyOneMinute = "*/1 * * * *" 
        useCron(everyOneMinute, callback)
    }) 

    it.only("Should execute cron jobs by 2 secs", async function TestInterval() {
        const handler = () => console.log("now: ", Date.now())
        const params = {
            timeout: 2000, 
            clear: 6000 
        } 

        const {done} = await useInterval(handler, params.timeout, params.clear)
        
        expect(done).to.be.true
    })
})