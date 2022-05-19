import { Controller } from '@nestjs/common';
import { JobIdService } from './job-id.service';

@Controller()
export class JobIdController {
  constructor(private readonly jobIdService: JobIdService) {}

  checkDupAndInsert(jobId: string) {
    return this.jobIdService.checkDupAndInsert(jobId);
  }
}
