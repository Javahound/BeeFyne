import BaseModule from '../utils/structures/BaseModule'
import DiscordClient from '../client'
import logger from '../log'
import { SelfRolesGroupsConfiguration } from '../typeorm/entities/SelfRolesGroupsConfiguration'
import { AppDataSource } from '../index'
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js'
import { SelfRolesRole } from '../typeorm/entities/SelfRolesRole'

export default class ReactionRolesModule extends BaseModule {
    constructor() {
        super('ReactionRolesModule')
    }

    public async startup(client: DiscordClient) {
        const selfRoleGroups = await AppDataSource.getRepository(
            SelfRolesGroupsConfiguration
        )
            .createQueryBuilder('selfRolesGroupsConfiguration')
            .leftJoinAndSelect('selfRolesGroupsConfiguration.roles', 'roles')
            .getMany()

        selfRoleGroups.forEach((config: SelfRolesGroupsConfiguration) => {
            this.createSelfRolePost(client, config)
        })
        return
    }

    public async createSelfRolePost(
        client: DiscordClient,
        config: SelfRolesGroupsConfiguration
    ) {
        const channel = await client.channels.fetch(config.channelId)

        if (!channel) {
            logger.error(
                `SelfRolesModule: Couldn't fetch channel ${config.channelId}.`
            )
            return
        }

        if (!channel.isText()) {
            logger.error(
                `SelfRolesModule: Channel ${config.channelId} is not a textbased channel.`
            )
            return
        }

        const roles = config.roles
        if (!roles) {
            logger.error(
                `SelfRolesModule: Couldn't load the roles of the role group ${config.id}.`
            )
            return
        }

        if (roles.length === 0) {
            logger.warn(
                `SelfRolesModule: No roles in the role group ${config.id}, skipping this role group.`
            )
            return
        }

        const selectMenuOptions = roles.map((role: SelfRolesRole) => {
            return {
                value: role.roleId,
                label: role.roleName,
                description: role.shortDescription,
                emoji: role.emoji,
            }
        })

        const selectMenu = new MessageSelectMenu()
            .setCustomId(`selfrole_${config.id}`)
            .addOptions(selectMenuOptions)

        if (config.multiselect) {
            selectMenu.setMinValues(0).setMaxValues(roles.length)
        }

        const messageEmbed = this.createEmbededSelfRolePost(config)
        const selectMenuRow = new MessageActionRow().addComponents(selectMenu)

        if (!config.messageId) {
            const sentMessage = await channel.send({
                embeds: [messageEmbed],
                components: [selectMenuRow],
            })

            config.messageId = sentMessage.id
            await AppDataSource.getRepository(
                SelfRolesGroupsConfiguration
            ).save(config)
        } else if (config.updateMessage) {
            const message = await channel.messages.fetch(config.messageId)
            await message.edit({
                embeds: [messageEmbed],
                components: [selectMenuRow],
            })

            config.updateMessage = false
            await AppDataSource.getRepository(
                SelfRolesGroupsConfiguration
            ).save(config)
        }
    }

    public createEmbededSelfRolePost(config: SelfRolesGroupsConfiguration) {
        const roles = config.roles
        if (!roles) {
            logger.error(
                `SelfRolesModule: Couldn't load the roles of the role group ${config.id}.`
            )
            return
        }

        if (roles.length === 0) {
            logger.warn(
                `SelfRolesModule: No roles in the role group ${config.id}, skipping this role group.`
            )
            return
        }

        const messageEmbed = new MessageEmbed()
            .setColor(config.color)
            .setTitle(config.title)
            .setDescription(config.description)
            .setTimestamp(new Date(config.updatedAt))

        roles.forEach((role: SelfRolesRole) => {
            messageEmbed.addField(role.roleName, role.longDescription)
        })

        if (config.url) {
            messageEmbed.setURL(config.url)
        }

        if (config.multiselect) {
            messageEmbed.setFooter({ text: 'Mehrfachauswahl ist möglich!' })
        }

        return messageEmbed
    }
}
