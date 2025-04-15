import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  password: string;
}

export class RecruiterSignupDto extends UserSignupDto{
  @IsNotEmpty()
  companyId: string;
}

export class UserSigninDto{
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
