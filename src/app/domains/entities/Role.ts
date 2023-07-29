import { BaseEntity } from '@/common/persistence/BaseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RoleType } from '@/app/domains/enums/RoleType';
import { User } from '@/app/domains/entities/User';

@Entity('Role')
export class Role extends BaseEntity {
    @Column({ type: 'varchar', nullable: false, default: RoleType.CUSTOMER })
    type: string;

    @OneToMany(() => User, (user) => user.role, { eager: false, cascade: false })
    users: User[];
}
