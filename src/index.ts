import { Intents, Collection, Guild } from 'discord.js'
import { DataSource } from 'typeorm'
import { GuildConfiguration } from './typeorm/entities/GuildConfiguration'
import 'reflect-metadata'
import DiscordClient from './client'
import { getEnvironmentConfig } from './config'
import registerCommands from './utils/RegisterCommands'
import registerEvents from './utils/RegisterEvents'
import registerModules from './utils/RegisterModules'

const allIntents = new Intents(32767)

export const client = new DiscordClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

export const environmentConfig = getEnvironmentConfig()

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: environmentConfig.host,
    port: environmentConfig.port,
    username: environmentConfig.username,
    password: environmentConfig.password,
    database: environmentConfig.database,
    synchronize: environmentConfig.synchronize,
    logging: environmentConfig.logging,
    entities: ['src/typeorm/entities/**/*.ts'],
})
;(async () => {
    await AppDataSource.initialize()

    await registerEvents()
    await registerCommands()

    const configRepo = AppDataSource.getRepository(GuildConfiguration)
    const guildConfigs = await configRepo.find()
    const configs = new Collection<string, GuildConfiguration>()
    guildConfigs.forEach((config) => configs.set(config.guildId, config))

    client.configs = configs
    console.log(client.configs)
    await client.login(environmentConfig.discordToken)

    // after client login, because modules use the client in their startups
    await registerModules()
})()

client.once('ready', () => {
    console.log('client ready')
    if(environmentConfig.debugDMs) {
        const src = AppDataSource.getRepository(GuildConfiguration)
        const guildConf = src.find()
        const conf = new Collection<string, GuildConfiguration>()
        
    }
})
