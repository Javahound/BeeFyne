import {
    CommandInteraction,
    Interaction,
    MessageActionRow,
    MessageSelectMenu,
} from 'discord.js'
import BaseCommand from '../utils/structures/BaseCommand'
import DiscordClient from '../client'

export default class ModalTest extends BaseCommand {
    constructor() {
        super('modaltest', 'dev', 'test', [])
    }

    async execute(client: DiscordClient, interaction: CommandInteraction) {
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('selfrole_')
                .setPlaceholder('Nothing selected')
                .setMinValues(2)
                .setMaxValues(3)
                .addOptions([
                    {
                        label: 'Select me',
                        description: 'This is a description',
                        value: 'first_option',
                    },
                    {
                        label: 'You can select me too',
                        description: 'This is also a description',
                        value: 'second_option',
                    },
                    {
                        label: 'I am also an option',
                        description: 'This is a description as well',
                        value: 'third_option',
                    },
                ])
        )

        const row2 = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('selfrole_2')
                .setPlaceholder('Nothing selected')
                .setMinValues(2)
                .setMaxValues(3)
                .addOptions([
                    {
                        label: 'Select me',
                        description: 'This is a description',
                        value: 'first_option',
                    },
                    {
                        label: 'You can select me too',
                        description: 'This is also a description',
                        value: 'second_option',
                    },
                    {
                        label: 'I am also an option',
                        description: 'This is a description as well',
                        value: 'third_option',
                    },
                ])
        )

        await interaction.reply({
            content: 'Pong!',
            components: [row, row2],
        })
    }
}
