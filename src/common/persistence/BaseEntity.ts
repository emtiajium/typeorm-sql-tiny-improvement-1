import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt?: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt?: Date;

    @VersionColumn({ default: 1 })
    version?: number;
}
