import { Interaction } from 'discord.js'
import DiscordClient from '../../client'

export default abstract class BaseEvent {
    constructor(private _name: string) {}

    public get name(): string {
        return this._name
    }

    abstract execute(client: DiscordClient, ...args: any): Promise<void>
}
