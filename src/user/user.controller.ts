import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';

@Controller('profile')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProfile(@Request() req) {
    return this.userService.getUserProfile(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  updateProfile(@Request() req, @Body() dto: any) {
    return this.userService.updateUserProfile(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('picture')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@Request() req,@UploadedFile() file: Express.Multer.File){
    return this.userService.uploadImageToCloudinary(file, req.user.id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('resume')
  @UseInterceptors(FileInterceptor('file'))
  uploadResume(@Request() req,@UploadedFile() file: Express.Multer.File){
    return this.userService.uploadResumeToCloudinary(file, req.user.id)
  }
}

