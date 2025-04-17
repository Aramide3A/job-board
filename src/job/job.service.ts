import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JobType, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobDto } from './dto/createJob.dto';
import { updateJobDto } from './dto/updateJob.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async findall(jobType?, location?) {
    try {
      const filter: any = {};
      if (jobType) filter.jobType = JobType;
      filter.isOpen = true;
      const getJobs = await this.prisma.job.findMany({
        where: filter,
      });
      return getJobs;
    } catch (error) {
      throw new BadRequestException('Error getting all available jobs');
    }
  }

  async getAllCompanyListing(companyId: string, type?) {
    try {
      const filter: any = {};
      if (type) filter.type = type;

      filter.companyId = companyId;
      const listing = await this.prisma.job.findMany({
        where: filter,
      });
      if (!listing) throw new NotFoundException('No jobs found for comapny');
      return listing;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Error getting all available jobs for a particular company',
      );
    }
  }

  async getAJobListing(id: any) {
    try {
      const jobListing = await this.prisma.job.findUnique({
        where: { id },
      });
      return jobListing;
    } catch (error) {
      throw new BadRequestException('Error getting a particular job listing');
    }
  }

  async CreateJobListing(dto: CreateJobDto, companyId, user) {
    const findCompany = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!findCompany) throw new NotFoundException('Company does not exist');

    let userId = user.id;
    const getUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    const isRecruiter = getUser.companyId === findCompany.id;
    if (!isRecruiter)
      throw new UnauthorizedException(
        'You are not authorized to create this job listing under this company',
      );

    try {
      const {
        title,
        requirement,
        description,
        location,
        jobType,
        tags,
        salaryRange,
      } = dto;
      const newJob = await this.prisma.job.create({
        data: {
          title,
          requirement,
          description,
          location,
          jobType,
          tags,
          salaryRange,
          company: {
            connect: { id: companyId },
          },
          createdBy: {
            connect: { id: getUser.id },
          },
        },
      });
      return newJob;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating a job');
    }
  }

  async updateJobListing(dto: updateJobDto, jobId, user) {
    try {
      const findJob = await this.prisma.job.findUnique({
        where: { id: jobId },
      });
      if (!findJob) throw new NotFoundException('Job listing doesnt exist');

      const getCompany = await this.prisma.company.findFirst({
        where: { id: findJob.companyId },
      });
      if (!getCompany) throw new NotFoundException('Compant does not exist');

      let userId = user.id;
      const getUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!getUser) throw new NotFoundException('User does not exist');

      const isOwner = getUser.companyId === getCompany.id;
      const isAdmin = getUser.role === Role.ADMIN;
      if (!isOwner && !isAdmin)
        throw new UnauthorizedException(
          'You are not authorizedto update this  lsiting',
        );

      const updateJobData = { ...dto };
      dto;
      const updateListing = await this.prisma.job.update({
        where: { id: jobId },
        data: updateJobData,
      });

      return updateListing;
    } catch (error) {
      throw new BadRequestException('Error updating job listing');
    }
  }

  async deactivateJobListing(jobId, user) {
    try {
      const findJob = await this.prisma.job.findUnique({
        where: { id: jobId },
      });
      if (!findJob) throw new NotFoundException('Job listing doesnt exist');

      let userId = user.id;
      const getUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!getUser) throw new NotFoundException('User does not exist');

      const isOwner = getUser.companyId === findJob.companyId;
      const isAdmin = getUser.role === Role.ADMIN;
      if (!isOwner && !isAdmin)
        throw new UnauthorizedException(
          'You are not authorizedto update this  lsiting',
        );

      const updateListing = await this.prisma.job.update({
        where: { id: jobId },
        data: {
          isOpen: false,
        },
      });
      return updateListing;
    } catch (error) {
      throw new BadRequestException('Error deactivating job listing');
    }
  }

  async deleteJobListing(jobId, user) {
    try {
      const findJob = await this.prisma.job.findUnique({
        where: { id: jobId },
      });
      if (!findJob) throw new NotFoundException('Job listing doesnt exist');

      let userId = user.id;
      const getUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!getUser) throw new NotFoundException('User does not exist');

      const isOwner = getUser.companyId === findJob.companyId;
      const isAdmin = getUser.role === Role.ADMIN;
      if (!isOwner && !isAdmin)
        throw new UnauthorizedException(
          'You are not authorizedto update this  lsiting',
        );
      const deleteListing = await this.prisma.job.delete({
        where: { id: jobId },
      });
      return 'deleted successfully';
    } catch (error) {
      throw new BadRequestException('Error deleting job listing');
    }
  }
}
