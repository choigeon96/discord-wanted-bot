import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { JobIdService } from 'src/job-id/job-id.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobId } from 'src/job-id/entities/job-id.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobId])],
  providers: [CrawlerService, JobIdService],
})
export class CrawlerModule {}
