import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports : [PrismaModule, CloudinaryModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
