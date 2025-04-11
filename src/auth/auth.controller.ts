import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RecruiterSignupDto,
  UserSigninDto,
  UserSignupDto,
} from './dto/auth.dto';
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Public()
  @Post('signup/user')
  signUpUser(@Body() body: UserSignupDto) {
    return this.authservice.userSignUp(body);
  }

  @Public()
  @Post('signup/user')
  signUpRecruiter(@Body() body: RecruiterSignupDto) {
    return this.authservice.recruiterSignUp(body);
  }

  @Public()
  @Post('login')
  loginInUSer(@Body() body: UserSigninDto) {
    return this.authservice.login(body);
  }
}
