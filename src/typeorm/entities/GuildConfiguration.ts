import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'guild_configurations' })
export class GuildConfiguration {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, name: 'guild_id' })
    guildId: string

    @Column()
    prefix: string = '!'

    @Column({ name: 'welcome_chanel_id' })
    welcomeChannelId: string = '0'
}
