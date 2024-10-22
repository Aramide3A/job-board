import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstraints } from './constraints';
import { JwtStrategy } from './jwt_strategy';

@Module({
  imports : [
    JwtModule.register({
      secret : jwtConstraints.secret,
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
