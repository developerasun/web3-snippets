import { LogContext, logger } from "@/server/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // const ctx = new LogContext("windows", "mac", "linux");
  // const params = ctx.getParams();
  // console.log("constructor args: ", params);

  // // method overloading
  // ctx.doLog();
  // ctx.overload();
  // ctx.overload(456789);
  console.log("test api");
  const fromMiddleware = request.headers.get("magic-value");
  const _globalFoo = request.headers.get("global-foo");

  console.log({ fromMiddleware });
  console.log({ _globalFoo });

  console.log("from global: ", global.FOO);
  
  // should throw error
  // global.FOO = "wwwwww"

  return NextResponse.json({
    message: "hello jake",
  });
}
