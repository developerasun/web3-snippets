import pino from 'pino'

const logPath = 'server/log/log.txt'
export const logger = pino({
    timestamp: pino.stdTimeFunctions.isoTime,
    base: undefined
}, pino.destination({
    dest:  logPath,
    append: true
}))