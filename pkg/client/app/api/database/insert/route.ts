import { initDatabase, insertMockData } from "@/server/lib/model";
import { logger } from "@/server/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  logger.info("running db op");
  insertMockData();
  logger.info("ending db op");

  return NextResponse.json({
    message: "running insert query on mysql docker",
  });
}
