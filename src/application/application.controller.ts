import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { application } from 'express';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('application')
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}
  @Get()
  getAllUserApplications(@Request() req) {
    return this.applicationService.getAllUserApplication(req.user);
  }

  @Get(':applicationId')
  getOneApplication(@Param('applicationId') applicationId) {
    return this.applicationService.getOneApplication(applicationId);
  }

  @Roles(['ADMIN',"RECRUITER"])
  @Get('company/:companyId')
  getAllCompanyApplications(@Param('companyId') companyId) {
    return this.applicationService.getAllCompanyApplication(companyId);
  }

  @Post(':jobId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'resume', maxCount: 1 },
      { name: 'cover_letter', maxCount: 1 },
    ]),
  )
  createapplication(@Param('jobId') jobId, @Request() req, @UploadedFiles() files: {resume?: Express.Multer.File[], cover_letter? : Express.Multer.File[]}) {
    return this.applicationService.createApplication(
      jobId,
      req.user.id,
      files
    );
  }

  @Roles(['ADMIN',"RECRUITER"])
  @Put(':applicationId/accept')
  acceptApplication(@Param('applicationId') applicationId) {
    return this.applicationService.acceptApplication(applicationId);
  }

  @Roles(['ADMIN',"RECRUITER"])
  @Put(':applicationId/reject')
  rejectApplication(@Param('applicationId') applicationId) {
    return this.applicationService.rejectApplication(applicationId,);
  }

}
