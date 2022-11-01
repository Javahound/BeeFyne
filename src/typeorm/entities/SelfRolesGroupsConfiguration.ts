import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { SelfRolesRole } from './SelfRolesRole'
import { HexColorString } from 'discord.js'

@Entity({ name: 'selfroles_groups_configuration' })
export class SelfRolesGroupsConfiguration {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'guild_id' })
    guildId: string

    @Column({ name: 'channel_id' })
    channelId: string

    @Column()
    multiselect: boolean

    @Column()
    title: string

    @Column({ type: 'varchar' })
    color: HexColorString

    @Column({ nullable: true })
    url?: string

    @Column()
    description: string

    // when first posted, add messageId so it doesnt post again
    @Column({ nullable: true })
    messageId?: string

    // bool wether the message needs to be updated (after changed made to it)
    @Column()
    updateMessage: boolean = false

    @OneToMany(
        () => SelfRolesRole,
        (selfRolesRole) => selfRolesRole.selfRolesGroup,
        { onDelete: 'SET NULL' }
    )
    roles: SelfRolesRole[]

    @UpdateDateColumn()
    updatedAt: string

    @CreateDateColumn()
    createdAt: string
}
