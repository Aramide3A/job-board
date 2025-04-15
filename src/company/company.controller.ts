import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('logo'))
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Request() req,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    return this.companyService.create(createCompanyDto, req.user, logo);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Roles(['ADMIN', 'RECRUITER'])
  @Put(':id')
  @UseInterceptors(FileInterceptor('logo')) 
  updateCompany(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @UploadedFile() logo?: Express.Multer.File
  ) {
    return this.companyService.update(req.user,id, dto, logo);
  }

  @Roles(['ADMIN', 'RECRUITER'])
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req,) {
    return this.companyService.remove(req.user,id);
  }
  
}
