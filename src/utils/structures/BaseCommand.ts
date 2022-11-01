import { Interaction } from 'discord.js'
import DiscordClient from '../../client'

export default abstract class BaseCommand {
    constructor(
        private _name: string,
        private _category: string,
        private _description: string,
        private _aliases: Array<string>
    ) {}

    public get name(): string {
        return this._name
    }
    public get category(): string {
        return this._category
    }
    public get description(): string {
        return this._description
    }
    public get aliases(): Array<string> {
        return this._aliases
    }

    abstract execute(
        client: DiscordClient,
        interaction: Interaction
    ): Promise<void>
}
