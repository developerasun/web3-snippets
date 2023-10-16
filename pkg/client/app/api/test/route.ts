import { logger } from "@app/server/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    logger.info("name check: jake")
    logger.warn("something serious going on here")

    return NextResponse.json({
        message: "hello jake"
    })
}
