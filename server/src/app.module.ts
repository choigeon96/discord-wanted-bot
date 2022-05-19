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
      port: 5432,
      database: 'gchoi',
      username: 'gchoi',
      password: 'gchoi',
      host: 'postgres-db',
      entities: [__dirname + '/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class AppModule {}
