import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mongoDbConfig from './mongodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [mongoDbConfig],
    }),
  ],
})
export class ConfigsModule {}
