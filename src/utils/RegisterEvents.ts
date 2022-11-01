import { client } from '../index'
import fs from 'fs'
import path from 'path'

import logger from '../log'

const registerEvents = async () => {
    const eventDir = path.join(__dirname, '../events')
    const eventFiles = fs
        .readdirSync(eventDir)
        .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

    for (const file of eventFiles) {
        const { default: Event } = await import(path.join(eventDir, file))
        const event = new Event()

        client.addEvent(event)
        client.on(event.name, event.execute.bind(event, client))
    }

    logger.info('Registered events')
}

export default registerEvents
