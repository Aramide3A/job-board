import { IsEmail, IsNotEmpty } from 'class-validator';

export class userSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  phone: string;
  
  @IsNotEmpty()
  password: string;
}
