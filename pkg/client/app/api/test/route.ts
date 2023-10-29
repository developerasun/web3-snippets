import { LogContext, logger } from "@app/server/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const ctx = new LogContext("windows", "mac", "linux");
  const params = ctx.getParams();
  console.log("constructor args: ", params);

  // method overloading
  ctx.doLog();
  ctx.overload();
  ctx.overload(456789);

  return NextResponse.json({
    message: "hello jake",
  });
}
