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
      port: 5433,
      database: 'gchoi',
      username: 'gchoi',
      password: '1234',
      host: '127.0.0.1',
      entities: [__dirname + '/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class AppModule {}
