import { DatabaseType, DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { DatabaseConfig } from '@/common/persistence/DatabaseConfig';
import { DatabaseNamingStrategy } from '@/common/persistence/DatabaseNamingStrategy';
import { ConfigService } from '@nestjs/config';

config();

const persistence = new DatabaseConfig();

function getEnvironmentVariableValue(key: string): string {
    return new ConfigService().get(key);
}

export default new DataSource({
    type: persistence.type as DatabaseType,
    host: persistence.host,
    port: persistence.port,
    username: persistence.username,
    password: persistence.password,
    database: persistence.database,
    synchronize: false,
    entities: [getEnvironmentVariableValue('TYPEORM_ENTITIES')],
    migrationsTableName: 'Migration',
    migrations: [getEnvironmentVariableValue('TYPEORM_MIGRATIONS')],
    namingStrategy: new DatabaseNamingStrategy(),
} as DataSourceOptions);
