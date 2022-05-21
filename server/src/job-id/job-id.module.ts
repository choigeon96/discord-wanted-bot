import { Module } from '@nestjs/common';
import { JobIdService } from './job-id.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobId } from './entities/job-id.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobId])],
  providers: [JobIdService],
})
export class JobIdModule {}
