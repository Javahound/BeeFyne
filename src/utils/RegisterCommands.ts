import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { Intents } from 'discord.js'
import { client, environmentConfig } from '../index'
import fs from 'fs'
import path from 'path'

import { SlashCommandBuilder } from '@discordjs/builders'
import logger from '../log'

const registerCommands = async () => {
    const commandDeployArray = []
    const commandDir = path.join(__dirname, '../commands')
    const commandFiles = fs
        .readdirSync(commandDir)
        .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

    for (const file of commandFiles) {
        const { default: Command } = await import(path.join(commandDir, file))
        const command = new Command()

        client.addCommand(command)

        // data for deployment
        const commandDeployData = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
        commandDeployArray.push(commandDeployData.toJSON())
    }

    const rest = new REST({ version: '9' }).setToken(
        environmentConfig.discordToken
    )

    try {
        logger.info('Started refreshing application (/) commands.')

        await rest.put(Routes.applicationCommands(environmentConfig.clientId), {
            body: commandDeployArray,
        })

        logger.info('Successfully reloaded application (/) commands.')
    } catch (error) {
        logger.error(error)
    }
}

export default registerCommands
