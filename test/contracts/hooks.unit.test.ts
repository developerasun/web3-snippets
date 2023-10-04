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

})