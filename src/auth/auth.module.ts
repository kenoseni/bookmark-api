import { Module } from '@nestjs/common';
// import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.contoller';
import { AuthService } from './auth.service';

@Module({
  // imports: [PrismaModule], // gives you access to the providers in that module.
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
