import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express/multer';

@Controller('profile')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getProfile(@Request() req) {
    return this.userService.getUserProfile(req.user.id);
  }

  @Put('update')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'resume', maxCount: 1 },
    ]),
  )
  updateProfile(
    @Request() req,
    @Body() dto: any,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      resume?: Express.Multer.File[];
    },
  ) {
    return this.userService.updateUserProfile(req.user.id, dto, files);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('picture')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadImage(@Request() req,@UploadedFile() file: Express.Multer.File){
  //   return this.userService.uploadImageToCloudinary(file, req.user.id)
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('resume')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadResume(@Request() req,@UploadedFile() file: Express.Multer.File){
  //   return this.userService.uploadResumeToCloudinary(file, req.user.id)
  // }
}
