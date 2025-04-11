// import {
//   BadRequestException,
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   ParseIntPipe,
//   Post,
//   Put,
//   Query,
//   Request,
//   UseGuards,
// } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { JobService } from './job.service';
// import { ListingDto } from './dto/createListing.dto';
// import { updateListingDto } from './dto/updateListing.dto';
// import { Roles } from 'src/auth/decorator/roles.decorator';
// import { JwtAuthGuard } from 'src/auth/auth.guard';

// @Controller('job')
// export class JobController {
//   constructor(private jobService: JobService) {}

//   @Get()
//   getAllJobListing(@Query('type') type?:String,@Query('location') location?:String) {
//     return this.jobService.getListing(type,location);
//   }

//   @Get()
//   @Roles(['Admin'])
//   getAllJobListingAdmin(@Request() req,@Query('type') type?:String,@Query('location') location?:String) {
//     return this.jobService.getAllListing(req.user.id,type,location);
//   }

//   @Get(':id')
//   getJobListing(@Param('id') id: number) {
//     return this.jobService.getAJob(id);
//   }

//   @Get(':id/application')
//   @Roles(['Admin'])
//   getJobApplication(@Param('id') jobId, @Request() req) {
//     return this.jobService.getJobApplication(jobId, req.user.id);
//   }

//   @Post('new')
//   @Roles(['Admin'])
//   createJobListing(@Body() dto: ListingDto, @Request() req) {
//     const deadline = new Date(dto.deadline);
//     if (isNaN(deadline.getTime())) {
//       throw new BadRequestException('Invalid date format for deadline');
//     }
//     return this.jobService.CreateJobListing(dto, req.user.id);
//   }

//   @Put(':id/update')
//   @Roles(['Admin'])
//   updateJobListing(@Param('id') id, @Body() dto:updateListingDto) {
//     return this.jobService.updateJobListing(dto,id);
//   }

//   @Put(':id/deactivate')
//   @Roles(['Admin'])
//   deactivateJobListing(@Param('id') jobId) {
//     return this.jobService.deactivateJobListing(jobId);
//   }

//   @Delete(':id/delete')
//   @Roles(['Admin'])
//   deleteJobListing(@Param('id') jobId) {
//     return this.jobService.deleteJobListing(jobId);
//   }
// }
