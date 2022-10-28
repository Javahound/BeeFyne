import { Client, ClientOptions, Collection } from 'discord.js'
import BaseCommand from './utils/structures/BaseCommand'
import BaseEvent from './utils/structures/BaseEvent'
import { GuildConfiguration } from './typeorm/entities/GuildConfiguration'
import BaseModule from './utils/structures/BaseModule'

export default class DiscordClient extends Client {
    private _configs = new Collection<string, GuildConfiguration>()
    private _commands = new Collection<string, BaseCommand>()
    private _events = new Collection<string, BaseEvent>()
    private _modules = new Collection<string, BaseModule>()

    constructor(options: ClientOptions) {
        super(options)
    }

    get configs() {
        return this._configs
    }
    get commands() {
        return this._commands
    }
    get events() {
        return this._events
    }
    get modules() {
        return this._modules
    }

    set configs(guildConfigs: Collection<string, GuildConfiguration>) {
        this._configs = guildConfigs
    }
    set commands(commands: Collection<string, BaseCommand>) {
        this._commands = commands
    }
    set events(events: Collection<string, BaseEvent>) {
        this._events = events
    }
    set modules(modules: Collection<string, BaseModule>) {
        this._modules = modules
    }

    addCommand(command: BaseCommand) {
        // sets adds to the collection
        this._commands.set(command.name, command)
    }

    addEvent(event: BaseEvent) {
        // sets adds to the collection
        this._events.set(event.name, event)
    }

    addModule(module: BaseModule) {
        // sets adds to the collection
        this._modules.set(module.name, module)
    }
}
