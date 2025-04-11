import { IsNotEmpty } from 'class-validator';

export class ProfileDto {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  bio: string;

  @IsNotEmpty()
  skills: string[];
}
