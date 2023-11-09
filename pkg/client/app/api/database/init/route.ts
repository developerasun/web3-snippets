import { initDatabase } from "@/server/lib/model";
import { logger } from "@/server/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  logger.info("running db op");
  initDatabase();
  logger.info("ending db op");

  return NextResponse.json({
    message: "running database init on mysql docker",
  });
}
