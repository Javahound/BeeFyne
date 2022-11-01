import BaseEvent from '../utils/structures/BaseEvent'
import DiscordClient from '../client'
import { Collection, Interaction, Role, Snowflake } from 'discord.js'
import logger from '../log'
import { AppDataSource } from '../index'
import { SelfRolesGroupsConfiguration } from '../typeorm/entities/SelfRolesGroupsConfiguration'
import { SelfRolesRole } from '../typeorm/entities/SelfRolesRole'
import { ReceiveStatusUpdates } from '../typeorm/entities/StatusUpdates'
import { GuildConfiguration } from '../typeorm/entities/GuildConfiguration'

export default abstract class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super('interactionCreate')
    }

    async execute(client: DiscordClient, interaction: Interaction) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName)

            if (!command) {
                await interaction.reply({
                    content: `The \'${interaction.commandName}\' does not exist.`,
                    ephemeral: true,
                })
                return
            }

            try {
                await command.execute(client, interaction)
            } catch (err) {
                await interaction.reply({
                    content: `There was an error while executing command \'${interaction.commandName}\'!`,
                    ephemeral: true,
                })
                logger.error(err)
                return
            }
        } else if (interaction.isSelectMenu()) {
            // self roles
            if (interaction.customId.startsWith('selfrole_')) {
                if (!interaction.inCachedGuild()) {
                    return
                }

                const guildRoles = interaction.guild.roles.cache
                const memberRolesArray = Array.from(
                    interaction.member.roles.cache.keys()
                )
                const selfRolesGroupId = interaction.customId.slice(
                    'selfrole_'.length
                )

                const selfRolesGroupConfig = await AppDataSource.getRepository(
                    SelfRolesGroupsConfiguration
                )
                    .createQueryBuilder('selfRolesGroupConfiguration')
                    .leftJoinAndSelect(
                        'selfRolesGroupConfiguration.roles',
                        'roles'
                    )
                    .where('selfRolesGroupConfiguration.id = :id', {
                        id: selfRolesGroupId,
                    })
                    .getOne()
                const availableRoles = selfRolesGroupConfig.roles.map(
                    (role: SelfRolesRole) => role.roleId
                )
                const selectedRoles = interaction.values

                const rolesToAdd: Collection<string, Role> = new Collection<
                    string,
                    Role
                >()
                const rolesToRemove: Collection<string, Role> = new Collection<
                    string,
                    Role
                >()

                // roles to add to the member (filter out roles that the member already has)
                selectedRoles.forEach((roleId: string) => {
                    if (!memberRolesArray.includes(roleId)) {
                        rolesToAdd.set(roleId, guildRoles.get(roleId))
                    }
                })

                // roles to remove from the member (filter out every role that isnt even available (important!)
                // and every role that is still selected)
                memberRolesArray.forEach((roleId: string) => {
                    if (
                        availableRoles.includes(roleId) &&
                        !selectedRoles.includes(roleId)
                    ) {
                        rolesToRemove.set(roleId, guildRoles.get(roleId))
                    }
                })

                const updatedMember = await interaction.member.roles.add(
                    rolesToAdd
                )
                await updatedMember.roles.remove(rolesToRemove)

                await interaction.deferUpdate()
            }
        }
    }
}
