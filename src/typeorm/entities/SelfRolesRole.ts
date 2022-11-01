import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { SelfRolesGroupsConfiguration } from './SelfRolesGroupsConfiguration'

@Entity({ name: 'selfroles_roles' })
export class SelfRolesRole {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true, name: 'role_id' })
    roleId: string

    @Column({ name: 'role_name' })
    roleName: string

    @Column({ nullable: true })
    emoji?: string

    @Column()
    shortDescription: string

    @Column()
    longDescription: string

    @ManyToOne(
        () => SelfRolesGroupsConfiguration,
        (selfRolesGroupsConfiguration) => selfRolesGroupsConfiguration.roles,
        { onDelete: 'CASCADE' }
    )
    selfRolesGroup: SelfRolesGroupsConfiguration

    @UpdateDateColumn()
    updatedAt: string

    @CreateDateColumn()
    createdAt: string
}
