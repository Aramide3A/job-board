import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async getUserProfile(id: string) {
    try {
      const getUser = await this.prisma.user.findUnique({
        where: { id },
        include: { profile: true },
      });
      if (!getUser) throw new NotFoundException('User not found');
      delete getUser.password;
      return getUser;
    } catch (error) {
      throw new BadRequestException('Error getting user profile');
    }
  }

  async updateUserProfile(id: any, body: ProfileDto, files) {
    try {
      const { phone, bio, skills } = body;

      const uploadProfilePicture = await this.cloudinary.uploadImage(
        files.profilePicture,
      );
      let profile_picture = uploadProfilePicture.secure_url;

      const uploadResume = await this.cloudinary.uploadImage(files.resume);
      let resume = uploadResume.secure_url;

      const updateProfile = await this.prisma.profile.update({
        where: { id },
        data: { phone, bio, resume, skills, profile_picture },
      });
      return updateProfile;
    } catch (error) {
      throw new BadRequestException('Error updating user profile');
    }
  }

  // async uploadImageToCloudinary(file: Express.Multer.File, id:any) {
  //   const upload=  await this.cloudinary.uploadImage(file)
  //   const profile = upload.secure_url
  //   const updateProfile = await this.prisma.user.update({
  //     where: { id },
  //     data: { profile_picture: profile},
  //   });
  //   return "image upload successful"
  // }

  // async uploadResumeToCloudinary(file: Express.Multer.File, id:any) {
  //   const upload=  await this.cloudinary.uploadImage(file)
  //   const resume = upload.secure_url
  //   const updateResume = await this.prisma.user.update({
  //     where: { id },
  //     data: { resume: resume},
  //   });
  //   return "resume upload successful"
  // }
}
