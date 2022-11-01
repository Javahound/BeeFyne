import { Intents, Collection } from 'discord.js'
import { DataSource } from 'typeorm'
import { GuildConfiguration } from './typeorm/entities/GuildConfiguration'
import 'reflect-metadata'
import DiscordClient from './client'
import { getEnvironmentConfig } from './config'
import registerCommands from './utils/RegisterCommands'
import registerEvents from './utils/RegisterEvents'
import registerModules from './utils/RegisterModules'
import { ReceiveStatusUpdates } from './typeorm/entities/StatusUpdates'

const allIntents = new Intents(32767)

// const client = new DiscordClient({
//     intents: allIntents,
// })

export const client = new DiscordClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

let updateConfig
let configReceiveUpdates

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

    const receiveUpdates = AppDataSource.getRepository(ReceiveStatusUpdates)
    configReceiveUpdates = await receiveUpdates.find()
    updateConfig = new Collection<boolean, ReceiveStatusUpdates>()
    configReceiveUpdates.forEach((updates) => updateConfig.set(updates.wantsUpdates, updates))

    client.configs = configs
    console.log(client.configs)

    await client.login(environmentConfig.discordToken)

    // after client login, because modules use the client in their startups
    await registerModules()
})()

client.once('ready', async () => {
    console.log('client ready')
    client.user.setActivity('out for you :3', { type: 'WATCHING' });

    var user2 = '279117671855947789'
    var startup = await client.users.fetch(user2) 
    // startup.send("I'm back online!")
    
    configReceiveUpdates.forEach((updates) => {
        updateConfig.get(updates.wantsUpdates, updates)
    })
})

//joined a server
client.on("guildCreate", async guild => {
    console.log("Joined a new guild: " + guild.name + ", " + guild.id)
    var guildId = guild.id

    var guildName = guild.name
    var guildOwnerId = guild.ownerId
    
    const configRepo = AppDataSource.getRepository(GuildConfiguration)
    const config = new GuildConfiguration()
    config.guildId = guildId
    config.guildName = guildName
    config.guildOwner = guildOwnerId
    config.prefix = '!'
    config.welcomeChannelId = '0'

    const updateRepo = AppDataSource.getRepository(ReceiveStatusUpdates)
    const updates = new ReceiveStatusUpdates()
    updates.guildOwner = guildOwnerId
    updates.wantsUpdates = false

    await updateRepo.save(updates)
    await configRepo.save(config)

    var user = await client.users.fetch(guildOwnerId)
    user.send("Thanks for adding me to \"" + guildName + "\"! Type '/help' in your server to see a list of commands. For more information, visit https://javahound.site/projects/[BOTNAME]") 

})

//removed from a server
client.on("guildDelete", async guild => {
    console.log("Left a guild: " + guild.name + ", " + guild.id);
    
    var guildId = guild.id

    var guildName = guild.name
    var guildOwnerId = guild.ownerId

    var user = await client.users.fetch(guildOwnerId)
    user.send("I am sorry to see you go. I have been removed from \"" + guildName 
                + "\"\nIf you have any feedback, please let me know at [LINK].")

    await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(GuildConfiguration)
    .where("guild_id = :id", { id: guild.id })
    .execute()

    await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(ReceiveStatusUpdates)
    .where("guild_owner = :id", { id: guild.ownerId })
    .execute()

})