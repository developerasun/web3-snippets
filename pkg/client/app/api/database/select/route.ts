import { initDatabase, insertMockData, selectMockData } from "@/server/lib/model";
import { logger } from "@/server/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  logger.info("running db op");
  selectMockData();
  logger.info("ending db op");

  return NextResponse.json({
    message: "running select query on mysql docker",
  });
}
