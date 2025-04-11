import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private cloudinary:CloudinaryService) {}

  async getUserProfile(id: any) {
    const getProfile = await this.prisma.user.findUnique({
      where: { id },
    });
    delete getProfile.password
    return getProfile;
  }

  async updateUserProfile(id: any, dto) {
    const {email,name,phone,resume,profile_picture,location,work_experience} = dto;
    const updateProfile = await this.prisma.user.update({
      where: { id },
      data: { email,name,resume,profile_picture,location,work_experience },
    });
    return updateProfile
  }

  async uploadImageToCloudinary(file: Express.Multer.File, id:any) {
    const upload=  await this.cloudinary.uploadImage(file)
    const profile = upload.secure_url
    const updateProfile = await this.prisma.user.update({
      where: { id },
      data: { profile_picture: profile},
    });
    return "image upload successful"
  }

  async uploadResumeToCloudinary(file: Express.Multer.File, id:any) {
    const upload=  await this.cloudinary.uploadImage(file)
    const resume = upload.secure_url
    const updateResume = await this.prisma.user.update({
      where: { id },
      data: { resume: resume},
    });
    return "resume upload successful"
  }
}
