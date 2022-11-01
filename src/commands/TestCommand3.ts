import { CommandInteraction, Interaction } from 'discord.js'
import BaseCommand from '../utils/structures/BaseCommand'
import DiscordClient from '../client'

export default class TestCommand2 extends BaseCommand {
    constructor() {
        super('test2', 'testcommands', 'this is a testcommand', [])
    }

    async execute(client: DiscordClient, interaction: CommandInteraction) {
        await interaction.reply('testcommand2 reply!')
    }
}
