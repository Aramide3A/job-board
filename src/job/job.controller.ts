import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JobService } from './job.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CreateJobDto } from './dto/createJob.dto';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  getAllJobListing(@Query('type') type?: String) {
    return this.jobService.findall(type);
  }

  @Get(':id')
  getJobListing(@Param('id') id: number) {
    return this.jobService.getAJobListing(id);
  }

  @Get('company/:companyId')
  getAllCompanyJobListing(@Param('companyId') companyId, @Query('type') type?: String) {
    return this.jobService.getAllCompanyListing(companyId, type);
  }

  @Post('company/:companyId')
  @Roles(['ADMIN', 'RECRUITER'])
  createJobListing(
    @Body() dto: CreateJobDto,
    @Request() req,
    @Param('companyId') companyId,
  ) {
    return this.jobService.CreateJobListing(dto, companyId, req.user);
  }

  @Put(':id')
  @Roles(['ADMIN', 'RECRUITER'])
  updateJobListing(
    @Param('id') jobId,
    @Param() companyId,
    @Body() dto,
    @Request() req,
  ) {
    return this.jobService.updateJobListing(dto, jobId, req.user);
  }

  @Put(':id/deactivate')
  @Roles(['ADMIN', 'RECRUITER'])
  deactivateJobListing(@Param('id') jobId, @Request() req) {
    return this.jobService.deactivateJobListing(jobId, req.user);
  }

  @Delete(':id')
  @Roles(['ADMIN', 'RECRUITER'])
  deleteJobListing(@Param('id') id, @Request() req) {
    return this.jobService.deleteJobListing(id, req.user);
  }
}
