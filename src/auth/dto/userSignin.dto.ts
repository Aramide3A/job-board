import { IsEmail, IsNotEmpty } from 'class-validator';

export class userSigninDto {
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  password: string;
}
