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

  async checkDup(jobId: string) {
    const isDup = await this.jobIdRepository.findOne({ where: { jobId } });
    return isDup ? true : false;
  }

  async insertJobId(jobId: string) {
    const result = await this.jobIdRepository.save({ jobId });
    return result ? true : false;
  }
}
