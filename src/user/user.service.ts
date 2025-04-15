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
      const getProfile = await this.prisma.profile.findUnique({
        where: {userId : id}
      })

      if(!getProfile) throw new NotFoundException("Profile doesnt exist")

      const { phone, bio, skills } = body;

      let profile_picture: string | undefined;
      let resume: string | undefined;

      if (files?.profile_picture?.[0]) {
        const uploadProfilePicture = await this.cloudinary.uploadImage(
          files.profile_picture[0],
        );
        profile_picture = uploadProfilePicture.secure_url;
      }

      if (files?.resume?.length) {
        const uploadResume = await this.cloudinary.uploadImage(files.resume);
        resume = uploadResume.secure_url;
      }
      const updateProfileDate: any = { phone, bio, skills };

      if (resume) updateProfileDate.resume = resume;
      if (profile_picture) updateProfileDate.profile_picture = profile_picture;

      const updateProfile = await this.prisma.profile.update({
        where: { userId: id },
        data: updateProfileDate,
      }); 

      return updateProfile;
    } catch (error) {
      console.log(error);
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
