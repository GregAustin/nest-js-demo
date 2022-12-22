import * as argon from 'argon2';

import { ForbiddenException, Injectable } from '@nestjs/common';

import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // Generate the password hash
    const hash = await argon.hash(dto.password);

    try {
      // Save the new user in the db
      const user = await this.prisma.user.create({
        data: { email: dto.email, hash },
      });

      delete user.hash;

      // Return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // If user does not exist, throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // Compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // If password does not exist throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    // Send back the user
    delete user.hash;
    return user;
  }
}
