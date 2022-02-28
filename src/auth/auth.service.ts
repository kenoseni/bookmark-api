import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(authDto: AuthDto) {
    try {
      // generate the password hash
      const hash = await argon.hash(authDto.password);

      // save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: authDto.email,
          hash,
        },
        // select: {
        //   id: true,
        //   email: true,
        //   createdAt: true,
        // },
      });

      // delete user.hash;
      // return the saved user
      return { token: await this.signToken(user.id, user.email) };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(authDto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    // if user does not exist, throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');
    // compare passwords
    const verifyPassword = await argon.verify(user.hash, authDto.password);

    // if password incorrect, throw exception
    if (!verifyPassword) throw new ForbiddenException('Credentials incorrect');

    return { token: await this.signToken(user.id, user.email) };
  }

  signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
