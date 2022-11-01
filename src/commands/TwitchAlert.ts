import { CommandInteraction, Interaction } from 'discord.js'
import BaseCommand from '../utils/structures/BaseCommand'
import DiscordClient from '../client'

export default class TestCommand2 extends BaseCommand {
    constructor() {
        super('twitch-alert', 'Alert command', 'Set up your twitch live notifications.', [])
    }

    async execute(client: DiscordClient, interaction: CommandInteraction) {
        await interaction.reply('alert reply!')
    }
}