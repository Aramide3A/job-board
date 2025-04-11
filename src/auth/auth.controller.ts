import { Body, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RecruiterSignupDto,
  UserSigninDto,
  UserSignupDto,
} from './dto/auth.dto';
import { Public } from './decorator/public.decorator';
import { LocalAuthGuard } from './guard/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Public()
  @Post('signup/user')
  signUpUser(@Body() body: UserSignupDto) {
    return this.authservice.userSignUp(body);
  }

  @Public()
  @Post('signup/recruiter/:companyId')
  signUpRecruiter(@Body() body: RecruiterSignupDto, @Param() companyId) {
    return this.authservice.recruiterSignUp(body,companyId);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  loginInUSer(@Request() req) {
    return this.authservice.login(req.user);
  }
}
