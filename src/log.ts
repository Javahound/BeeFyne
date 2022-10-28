import pino from 'pino'

const logger = pino({
    base: null,
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
})

export default logger
