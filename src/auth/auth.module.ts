import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
// import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.contoller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({})],
  // imports: [PrismaModule], // gives you access to the providers in that module.
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
