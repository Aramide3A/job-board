import { JobType } from '@prisma/client';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsString()
  jobType: JobType;

  tags: string[];

  @IsString()
  requirement: string;

  @IsString()
  salaryRange: string;
}
