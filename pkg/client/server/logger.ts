import pino from "pino";
import { mkdirSync, mkdir } from "fs";
import { promisify } from "util";

const _mkdir = promisify(mkdir);

const baseDir = "server/log";

const _initLogDir = async () => {
  await _mkdir(baseDir, { recursive: true });
};

const initLogDir = () => {
  mkdirSync(baseDir, { recursive: true });
};

const getDailyLogFile = () => {
  initLogDir();

  const date = new Date();
  const format = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`;
  return format;
};

const fullLogPath = `${baseDir}/${getDailyLogFile()}`;

const streams = [
  { stream: process.stdout },
  {
    stream: pino.destination({
      dest: fullLogPath,
      append: true,
      sync: true,
    }),
  },
];

export const logger = pino(
  {
    timestamp: pino.stdTimeFunctions.isoTime,
    base: undefined,
  },
  pino.multistream(streams)
);

@_logContext
export class LogContext {
  platform: string[];

  constructor(...args: string[]) {
    this.platform = args;
  }

  // function signature
  overload(): void;
  overload(message: number): void;

  // method implementation
  overload(message?: number) {
    if (message) {
      console.log("second signature: ", message);
    } else {
      console.log("first signature: void param");
    }
  }

  @logSender("jake") // method decorator
  doLog() {
    logger.info(`this will be logged in second order`);
  }

  getParams() {
    return this.platform;
  }
}

function logSender(message: string) {
  console.log("executed in closure");
  console.log(`got message from: ${message}`);

  return function (target: any, key: string, desc: PropertyDescriptor) {
    const method = desc.value;

    console.log({ target });
    console.log({ key });
    desc.value = function () {
      console.log("changing original method behavior");
      method(message);
      console.log("decorator done");
    };
  };
}

function _logContext(constructor: typeof LogContext) {
  console.log(constructor);
  console.log(constructor.name);
}
