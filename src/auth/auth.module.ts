import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
// import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.contoller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({})],
  // imports: [PrismaModule], // gives you access to the providers in that module.
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
