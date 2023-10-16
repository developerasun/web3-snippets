import pino from 'pino'
import { mkdirSync, mkdir } from 'fs'
import { promisify } from 'util'

const _mkdir = promisify(mkdir)

const baseDir = 'server/log'

const _initLogDir = async () => {
    await _mkdir(baseDir, { recursive: true })
}

const initLogDir = () => {
    mkdirSync(baseDir, {recursive: true})
}

const getDailyLogFile = () => {
    initLogDir()
    
    const date = new Date()
    const format = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.log`
    return format
}

const fullLogPath = `${baseDir}/${getDailyLogFile()}`

const streams = [
    { stream : process.stdout }, 
    { stream : pino.destination({
        dest: fullLogPath, 
        append: true,
        sync: true
    })}, 
]

export const logger = pino({
    timestamp: pino.stdTimeFunctions.isoTime,
    base: undefined
}, pino.multistream(streams))