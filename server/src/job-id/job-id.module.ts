import { Module } from '@nestjs/common';
import { JobIdService } from './job-id.service';
import { JobIdController } from './job-id.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobId } from './entities/job-id.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobId])],
  controllers: [JobIdController],
  providers: [JobIdService],
})
export class JobIdModule {}
