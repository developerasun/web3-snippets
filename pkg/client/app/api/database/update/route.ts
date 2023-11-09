import { initDatabase, insertMockData, selectMockData, updateMockData } from "@/server/lib/model";
import { logger } from "@/server/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  logger.info("running db op");
  updateMockData();
  logger.info("ending db op");

  return NextResponse.json({
    message: "running update query on mysql docker",
  });
}
