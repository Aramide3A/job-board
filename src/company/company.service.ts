import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { throwIfEmpty } from 'rxjs';
import { Role } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    user: any,
    logo?: Express.Multer.File,
  ) {
    try {
      const { name, description, location } = createCompanyDto;

      const checkCompany = await this.prisma.company.findUnique({
        where: { name },
      });
      if (checkCompany)
        throw new BadRequestException('Company with this name already exists');

      const getUser = await this.prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!getUser) throw new NotFoundException('User does not exist');

      if (getUser.companyId)
        throw new BadRequestException('User already has a company');

      let companyId = uuid().slice(0, 5);
      while (0 < 1) {
        const checkCompanyId = await this.prisma.company.findUnique({
          where: { companyId },
        });
        if (checkCompanyId) {
          companyId = uuid().slice(0, 5);
        } else break;
      }
      const createCompanyData: any = {
        name,
        description,
        companyId,
        location,
      };

      if (logo) {
        const upload_logo = await this.cloudinary.uploadImage(logo);
        createCompanyData.logo = upload_logo.secure_url;
      }

      const createCompany = await this.prisma.company.create({
        data: createCompanyData,
      });

      await this.prisma.user.update({
        where: { id: getUser.id },
        data: { companyId: createCompany.id },
      });

      if (getUser.role === Role.USER) {
        await this.prisma.user.update({
          where: { id: getUser.id },
          data: { role: Role.RECRUITER },
        });
      }
      return { message: 'Successful', data: createCompany };
    } catch (error) {
      throw new BadRequestException('error creating company');
    }
  }

  async findAll() {
    try {
      const getAllComany = await this.prisma.company.findMany({});
      return getAllComany;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error getting all company');
    }
  }

  async findOne(id: string) {
    try {
      const getCompany = await this.prisma.company.findUnique({
        where: { id },
      });
      if (!getCompany) throw new NotFoundException('Company not found');
      return getCompany;
    } catch (error) {
      throw new BadRequestException('error getting company');
    }
  }

  async update(
    user,
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    logo?: Express.Multer.File,
  ) {
    try {
      const existingCompany = await this.prisma.company.findUnique({
        where: { id },
      });

      if (!existingCompany) {
        throw new NotFoundException('Company not found');
      }

      const isOwner = user.companyId === existingCompany.id;
      if (!isOwner && user.role !== Role.ADMIN) {
        throw new UnauthorizedException(
          'You are not allowed to update this company',
        );
      }

      const updateData: any = { ...updateCompanyDto };

      if (logo) {
        const upload_logo = await this.cloudinary.uploadImage(logo);
        updateData.logo = upload_logo.secure_url;
      }

      const updatedCompany = await this.prisma.company.update({
        where: { id },
        data: updateData,
      });

      return { message: 'Company updated successfully', data: updatedCompany };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating company');
    }
  }

  async remove(user, id: string) {
    try {
      const existingCompany = await this.prisma.company.findUnique({
        where: { id },
      });

      if (!existingCompany) {
        throw new NotFoundException('Company not found');
      }
      const isOwner = user.companyId === existingCompany.id;
      if (!isOwner && user.role !== Role.ADMIN) {
        throw new UnauthorizedException(
          'You are not allowed to update this company',
        );
      }
      const deleteCompany = await this.prisma.company.delete({
        where: { id },
      });
      return { message: `Company with id ${id} deleted successfully` };
    } catch (error) {
      throw new BadRequestException('Error deleting company');
    }
  }
}
