import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DatabaseConfig } from '@/common/persistence/DatabaseConfig';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseNamingStrategy } from '@/common/persistence/DatabaseNamingStrategy';
import { LoggerOptions, DatabaseType } from 'typeorm';
import { User } from '@/app/domains/entities/User';
import { Role } from '@/app/domains/entities/Role';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (): TypeOrmModuleOptions => {
                const databaseConfig = new DatabaseConfig();

                return {
                    type: databaseConfig.type as DatabaseType,
                    host: databaseConfig.host,
                    port: databaseConfig.port,
                    username: databaseConfig.username,
                    password: databaseConfig.password,
                    database: databaseConfig.database,
                    entities: [User, Role],
                    synchronize: false,
                    logging: databaseConfig.logging as LoggerOptions,
                    namingStrategy: new DatabaseNamingStrategy(),
                    retryAttempts: 1,
                    autoLoadEntities: false,
                } as TypeOrmModuleOptions;
            },
        }),
    ],
})
export default class DatabaseModule {}
