import { BaseEntity } from '@/common/persistence/BaseEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Role } from '@/app/domains/entities/Role';

@Entity('User')
export class User extends BaseEntity {
    @Column({ type: 'varchar', nullable: false, unique: true })
    email: string;

    @ManyToOne(() => Role, (role) => role.users, { eager: false, nullable: false })
    role: Role;
}
