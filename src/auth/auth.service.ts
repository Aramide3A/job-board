import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  RecruiterSignupDto,
  UserSigninDto,
  UserSignupDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async userSignUp(body: UserSignupDto) {
    try {
      const { email, name, password } = body;

      const findUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (findUser) throw new BadRequestException('User already exists');

      const hashPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          password: hashPassword,
        },
      });

      const payload = { sub: user.id, email: user.email, role: user.role };

      const token = await this.jwtService.signAsync(payload);
      return { accessToken: token };
    } catch (error) {
      return new BadRequestException('Error Signing up user');
    }
  }

  async recruiterSignUp(body: RecruiterSignupDto) {
    try {
      const { email, name, password, companyId } = body;
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          password: hashPassword,
          company: { connect: { id: companyId } },
          role: Role.RECRUITER,
        },
      });

      const payload = { sub: user.id, email: user.email, role: user.role };

      const token = await this.jwtService.signAsync(payload);
      return { accessToken: token };
    } catch (error) {
      return new BadRequestException('Error Signing up recruiter');
    }
  }

  async login(body: UserSigninDto) {
    try {
      const { username, password } = body;
      const user = await this.prisma.user.findUnique({
        where: { email: username },
      });
      if (!user) throw new NotFoundException('Invalid Credentials');
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword)
        throw new BadRequestException('Invalid Credentials');

      const payload = { sub: user.id, email: user.email, role: user.role };

      const token = await this.jwtService.signAsync(payload);
      return { accessToken: token };
    } catch (error) {
      return new BadRequestException('Error logging in user');
    }
  }
}
