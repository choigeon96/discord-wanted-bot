import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CrawlerModule } from './schedule/crawler/crawler.module';
import { JobIdModule } from './job-id/job-id.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'local' ? '.local.env' : '.server.env',
    }),
    ScheduleModule.forRoot(),
    CrawlerModule,
    JobIdModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      entities: [__dirname + '/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class AppModule {}
