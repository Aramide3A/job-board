import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userSignupDto } from './dto/userSignup.dto';
import { userSigninDto } from './dto/userSignin.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Public()
  @Post('signup')
  signUpUser(@Body() dto:userSignupDto) {
    return this.authservice.signUp(dto);
  }

  @Public()
  @Post('login')
  loginInUSer(@Body() dto:userSigninDto) {
    return this.authservice.login(dto);
  }
}
