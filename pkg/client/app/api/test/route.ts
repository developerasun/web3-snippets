import { logger } from "@app/server/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    logger.info("name check: jake")
    logger.warn("something serious going on here")
    logger.error("bad bad things happened")

    return NextResponse.json({
        message: "hello jake"
    })
}
