import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobId } from './entities/job-id.entity';

@Injectable()
export class JobIdService {
  constructor(
    @InjectRepository(JobId)
    private readonly jobIdRepository: Repository<JobId>,
  ) {}

  async checkDupAndInsert(jobId: string) {
    try {
      const isDup = await this.jobIdRepository.findOne({ where: { jobId } });
      if (isDup) return false;
      const result = await this.jobIdRepository.save({ jobId });
      return result ? true : false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
