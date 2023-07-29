import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DatabaseModule from '@/common/persistence/DatabaseModule';
import { AppController } from '@/app/controllers/AppController';
import { AppService } from '@/app/services/AppService';

@Module({
    imports: [ConfigModule.forRoot({ envFilePath: '.env' }), DatabaseModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
