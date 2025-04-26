import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApplicationService {
  constructor(
    private prisma: PrismaService,
    private cloudindary: CloudinaryService,
  ) {}

  async getOneApplication(applicationId) {
    try {
      const findApplication = await this.prisma.application.findUnique({
        where: { id: applicationId },
      });
      if (!findApplication) throw new NotFoundException('User not found');
      return { findApplication };
    } catch (error) {
      throw new BadRequestException('Error getting One application');
    }
  }

  async getAllUserApplication(user) {
    try {
      const findUser = await this.prisma.user.findUnique({
        where: { id: user.id },
      });
      if (!findUser) throw new NotFoundException('User not found');

      const findAllApplications = await this.prisma.application.findMany({
        where: { applicantId: user.id },
      });
      if (!findAllApplications) throw new NotFoundException('User not found');
      return { findAllApplications };
    } catch (error) {
      throw new BadRequestException("Error getting user's applications");
    }
  }

  async getAllCompanyApplication(companyId) {
    try {
      const findCompany = await this.prisma.company.findUnique({
        where: { id: companyId },
      });
      if (!findCompany) throw new NotFoundException('company does not exist');

      const findCompanypplications = await this.prisma.application.findMany({
        where: { job: { companyId } },
      });
      if (!findCompanypplications)
        throw new NotFoundException('No company applications found');
      return { findCompanypplications };
    } catch (error) {
      throw new BadRequestException("Error getting company's applications");
    }
  }

  async createApplication(jobId, user, files) {
    try {
      let userId = user.id;
      const findUser = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });
      if (!findUser) throw new NotFoundException('User not found');

      const findJob = await this.prisma.job.findUnique({
        where: { id: jobId },
      });
      if (!findJob)
        throw new NotFoundException(`Job with id ${jobId} not found`);

      const findApplication = await this.prisma.application.findFirst({
        where: { AND: [{ applicantId: findUser.id }, { jobId: findJob.id }] },
      });
      if (findApplication) {
        throw new BadRequestException('Application already exists');
      }

      let resume: string | undefined;
      let cover_letter: string | undefined;

      if (files?.resume?.length) {
        const uploadResume = await this.cloudindary.uploadImage(
          files.resume[0],
        );
        resume = uploadResume.secure_url;
      } else {
        resume = findUser.profile.resume;
      }

      if (files?.cover_letter?.length) {
        const uploadCoverLetter = await this.cloudindary.uploadImage(
          files.cover_letter[0],
        );
        cover_letter = uploadCoverLetter.secure_url;
      } else {
        cover_letter = findUser.profile.cover_letter;
      }

      const createApplicationData: any = {
        applicant: {
          connect: { id: userId },
        },
        job: {
          connect: { id: jobId },
        },
        resume,
        cover_letter,
      };

      await this.prisma.application.create({
        data: createApplicationData,
      });

      return {
        msg: `Application for ${findJob.title} submitted successfully `,
      };
    } catch (error) {
      throw new BadRequestException('Error creating application');
    }
  }

  async acceptApplication(applicationId) {
    try {
      const { findApplication } = await this.getOneApplication(applicationId);
      await this.prisma.application.update({
        where: {
          id: findApplication.id,
        },
        data: {
          status: Status.ACCEPTED,
        },
      });
      return { msg: `Application accepted successfully` };
    } catch (error) {
      throw new BadRequestException('Error accepting application');
    }
  }

  async rejectApplication(applicationId) {
    try {
      const { findApplication } = await this.getOneApplication(applicationId);
      const updateApplication = await this.prisma.application.update({
        where: {
          id: findApplication.id,
        },
        data: {
          status: Status.REJCETED,
        },
      });
      return { msg: `Application rejected successfully ` };
    } catch (error) {
      throw new BadRequestException('Error rejecting application');
    }
  }
}
