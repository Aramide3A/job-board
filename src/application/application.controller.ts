import { Controller, Param, Post, Put, Request } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { application } from 'express';

@Controller(':id/application')
export class ApplicationController {
    constructor(private applicationService: ApplicationService){}

    @Post()
    createapplication(@Param('id') jobId,@Request() req){
        return this.applicationService.newApplication(jobId,req.user.id)
    }

    @Put(":applicationId/reject")
    rejectApplication(@Param('applicationId') applicationId,@Request() req){
        return this.applicationService.rejectApplication(applicationId,req.user.id)
    }

    @Put(":applicationId/accept")
    acceptApplication(@Param('applicationId') applicationId,@Request() req){
        return this.applicationService.acceptApplication(applicationId,req.user.id)
    }
}

