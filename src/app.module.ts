import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JobModule } from './job/job.module';
import { RolesGuard } from './auth/guard/role.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ApplicationModule } from './application/application.module';
import { JwtAuthGuard } from './auth/auth.guard';

@Module({
  imports: [AuthModule, PrismaModule, JobModule, UserModule, CloudinaryModule, ApplicationModule],
  controllers: [],
  providers: [
    JwtAuthGuard,
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
