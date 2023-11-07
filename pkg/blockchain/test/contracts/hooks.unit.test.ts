import { logger, useCron, useEpochTime, useInterval } from "@scripts/hook";
import { expect } from "chai";
import { DateTime, FixedOffsetZone } from "luxon";

const PREFIX = "hooks";

describe(`${PREFIX}-utility-hooks`, function TestHookFunctions() {
  it.skip("Should execute cron jobs every 1 mins", async function TestCron() {
    const callback = () => console.log("check");
    const everyOneMinute = "*/1 * * * *";
    useCron(everyOneMinute, callback);
  });

  it.skip("Should execute cron jobs by 2 secs", async function TestInterval() {
    const handler = () => console.log("now: ", Date.now());
    const params = {
      timeout: 2000,
      clear: 6000,
    };

    const { done } = await useInterval(handler, params.timeout, params.clear);

    expect(done).to.be.true;
  });

  it.skip("should log in two seconds", function TestLogInTwoSeconds() {
    setTimeout(() => {
      console.log("Wefwef");
    }, 2000);
  });

  it.skip("Should check promise orders", async function TestPromiseOrder() {
    let success: number[] = [];

    let retryAt: number = 999;

    async function pLog(index: number) {
      return await new Promise((resolve, reject) => {
        console.log(index);

        if (index !== 8) {
          // escape at index 8
          success.push(index);
          resolve(true);
        } else {
          reject(false);
        }
      });
    }

    try {
      for (let index = 0; index < 10; index++) {
        await pLog(index); // sequential execution
      }
    } catch (error) {
      console.error(error);
    } finally {
      console.log("done");
      console.log(success);
      console.log("success till index: ", success.length - 1);
      console.log("Failed at index: ", success.length);
      retryAt = success.length;
    }

    console.log("next promise execution index at: ", retryAt);
  });

  it.skip("Should log epoch time in seconds", function TestEpochTime() {
    const { utc, local } = useEpochTime();

    console.log({ utc });
    console.log({ local });
  });
});

describe(`${PREFIX}-OOP`, function TestObjectOriented() {
  it.skip("Should return different values with generics", function TestGeneric() {
    function returnValue<T>(name: T): T {
      return name;
    }

    expect(returnValue<number>(3)).to.equal(3);

    const target = { name: "Jake" };
    expect(returnValue(target)).to.equal(target);
  });

  it.skip("Should make different function signature", function TestOverloading() {
    // overload signature
    function greetings(name: string): string;
    function greetings(age: number): number;

    // overload implementation
    function greetings(arg: string | number) {
      return arg;
    }

    expect(greetings("jake")).to.equal("jake");
    expect(greetings(29)).to.equal(29);
  });

  it.skip("Should implement an interface", function TestImplementation() {
    interface greetings {
      sayHi: () => string;
    }

    class Hello implements greetings {
      private _name: string;

      constructor(name: string) {
        this._name = name;
      }

      sayHi() {
        return this._name;
      }
    }

    const hello = new Hello("jake");
    expect(hello.sayHi()).to.equal("jake");
  });
});

describe(`${PREFIX}-promise-handle`, function TestHandlePromise() {
  const handle = async (promise: Promise<unknown>) => {
    // prettier-ignore
    return promise
                .then((data) => { return [data, null]})
                .catch((error) => { return [null, error]})
  };

  async function typedHandle<T>(promise: Promise<T>) {
    // prettier-ignore
    return promise
          .then((data: T) => {
              return { data, error: undefined }
          })
          .catch((error: unknown) => { return { data: undefined, error } }) // error is not guaranteed to be an Error object. unknown type is recommended and mandatory
  }

  it.skip("Should resolve with handler", async function TestResolve() {
    const resolved = new Promise((resolve) => resolve({ name: "Jake" }));
    const [data, error] = await handle(resolved);

    if (error) {
      console.error(error);
    }

    if (data) {
      console.log({ data });
    }

    expect(error).to.be.null;
    expect(data).not.to.be.null;
  });

  it.skip("Should reject with handler", async function TestReject() {
    const rejected = new Promise((_, reject) => reject("REJECT: no reason"));
    const [data, error] = await handle(rejected);

    if (error) {
      console.error(error);
    }

    if (data) {
      console.log({ data });
    }
  });

  it.skip("Should resolve with return type", async function TestInferReturnType() {
    interface IHuman {
      name: string;
    }

    const resolved = new Promise<IHuman>((resolve, _) => resolve({ name: "Jake" }));

    const rHuman = await typedHandle<IHuman>(resolved);

    if (rHuman.data) {
      console.log(rHuman.data.name);
      expect(rHuman.data.name).to.equal("Jake");
    }

    expect(rHuman.error).to.be.undefined;
  });

  it.skip("Should reject but not throw", async function TestNoException() {
    interface ICat {
      sound: string;
    }

    const rejected = new Promise<ICat>((_, reject) => reject("REJECT: woof"));
    const rCat = await typedHandle<ICat>(rejected);

    if (rCat.error) {
      console.log("got rejected message : ", rCat.error);
    }

    expect(rCat.error).to.equal("REJECT: woof");
  });

  it.skip("Should convert UTC to local date time", async function TestTimeConversion() {
    // const utc = useEpochTime().utc;
    const seoulOffset = (3600 * 9) / 1000; // 9 hours ahead of utc

    const utc = useEpochTime().utc;
    const local = useEpochTime().local;
    console.table({ utc, local });
    console.trace({ utc, local });
  });

  it.skip("Should match for Jira issue key", async function TestJiraExpression() {
    const exampleJiraKey = "PP-123--fix-some-shit";
    const target = "PP-123--";
    const regex = new RegExp("[A-Z]+-[0-9]+--");
    console.log(exampleJiraKey.match(regex)?.[0]);

    expect(exampleJiraKey.match(regex)?.[0]).to.equal(target);
  });

  it.only("Should check a proper ipfs cid", async function TestCID() {
    const { cid } = await import("is-ipfs");
    const isValidCID = cid("QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB");

    expect(isValidCID).to.be.true;
  });
});
