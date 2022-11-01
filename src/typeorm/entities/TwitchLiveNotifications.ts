import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'live_notifications' })
export class LiveNotifications {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, name: 'guild_id' })
    guildId: string

    @Column({ name: 'twitch_name' })
    twitchName: string

    @Column({ name: 'golive_channel_id' })
    goLiveChannelId: string = '0'
}
