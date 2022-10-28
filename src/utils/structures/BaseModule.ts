import DiscordClient from '../../client'

export default abstract class BaseModule {
    constructor(private _name: string) {}

    public get name(): string {
        return this._name
    }

    abstract startup(client: DiscordClient): Promise<void>
}
