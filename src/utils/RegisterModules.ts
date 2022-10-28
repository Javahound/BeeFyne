import { client } from '../index'
import fs from 'fs'
import path from 'path'

import logger from '../log'

const registerEvents = async () => {
    const eventDir = path.join(__dirname, '../modules')
    const eventFiles = fs
        .readdirSync(eventDir)
        .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

    for (const file of eventFiles) {
        const { default: Module } = await import(path.join(eventDir, file))
        const module = new Module()
        logger.debug(`Registering module ${module.name}`)

        client.addModule(module)
        await module.startup(client)
        logger.info(`Module ${module.name} successfully loaded.`)
    }

    logger.info('Registered modules')
}

export default registerEvents
