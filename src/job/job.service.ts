import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListingDto } from './dto/createListing.dto';
import { Type } from '@prisma/client';
import { updateListingDto } from './dto/updateListing.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async getListing(type?,location?) {
    const filter:any = {}
    if(type) filter.type = type

    if(location) filter.location = location
    const listing = await this.prisma.job.findMany({
      where : filter
    });
    return listing;
  }

  async getAllListing(userId:any,type?,location?) {
    const filter:any = {}
    if(type) filter.type = type

    if(location) filter.location = location
    filter.userId = userId
    const listing = await this.prisma.job.findMany({
      where : filter
    });
    return listing;
  }

  async getJobApplication(jobId, userId) {
    const application = await this.prisma.application.findMany({
      where : {jobId, userId}
    });
    return application;
  }

  async getAJob(id: any) {
    const listing = await this.prisma.job.findUnique({
        where: {id}
    });
    return listing;
  }

  async CreateJobListing(dto: ListingDto, id){
    const {title, company_name, description, location, type, salary, deadline} = dto
    const jobType = Type[type]
    const newListing = await this.prisma.job.create({
        data : {
          user: {
            connect: { id }
          },title, company_name, description, location,type:jobType, salary, deadline
    }})
    return newListing
  }

  async updateJobListing(dto:updateListingDto , id) {
    const { title, company_name, description, location, type, salary, deadline } = dto;
    const jobType = Type[type]
    const updateListing = await this.prisma.job.update({
      where: { id },
      data: {
        title,
        company_name,
        description,
        location,
        type: jobType,
        salary,
        deadline,
      },
    });
  
    return updateListing;
  }  

  async deactivateJobListing(id) {
    const updateListing = await this.prisma.job.update({
      where: { id },
      data: {
        isAvailable : false
      },
    });
    return updateListing;
  }  

  async deleteJobListing(id){
    const deleteListing = await this.prisma.job.delete({
      where : {id}
    })
    return "deleted successfully"
  }
}
