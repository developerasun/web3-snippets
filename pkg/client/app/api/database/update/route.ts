import { initDatabase, insertMockData, selectMockData, updateMockData } from "@app/server/lib/model";
import { logger } from "@app/server/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    logger.info("running db op")
    updateMockData()
    logger.info("ending db op")
    
    return NextResponse.json({
        message: "running update query on mysql docker"
    })
}
