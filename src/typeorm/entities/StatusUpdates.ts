import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'status_updates' })
export class ReceiveStatusUpdates {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, name: 'id'})
    guildId: string

    @Column({ name: 'update_channel_id'})
    channelId: string

    @Column({ name: 'wantsUpdates' })
    wantsUpdates: boolean
}