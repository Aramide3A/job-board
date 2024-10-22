import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { userSignupDto } from './dto/userSignup.dto';
import * as bcryptjs from 'bcryptjs';
import { userSigninDto } from './dto/userSignin.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService : JwtService
  ) {}

  async signUp(dto: userSignupDto) {
    const {email, name, phone, password} = dto
    const hashPassword = await bcryptjs.hash(password,10) 
    const user = await this.prisma.user.create({
      data : {
        email, name,phone, hashPassword, role: Role.Admin
      }
    })

    const payload = { sub : user.id, email: user.email,role: user.role}
    
    const token = await this.jwtService.signAsync(payload)
    return {accessToken : token};
  }

  async login(dto:userSigninDto) {
    const {email, password} = dto
    const user = await this.prisma.user.findUnique({
      where: {email}
    })
    if (!user) throw NotFoundException
    const comparePassword = await bcryptjs.compare(password,user.hashPassword)
    if (!comparePassword) throw BadRequestException

    const payload = { sub : user.id, email: user.email,role: user.role}
    
    const token = await this.jwtService.signAsync(payload)
    return {accessToken : token};
  }
}
