import { logger } from "@app/server/logger";
import { NextResponse } from "next/server";
import { dump } from 'js-yaml'

export async function GET(request: Request) {
    const target = { 
        timestamp : 0,
        sender: 'jake'
    }

    const yaml = dump(target)
    
    return NextResponse.json({
        message: yaml, 
        comparison: JSON.stringify(target)
    })
}
