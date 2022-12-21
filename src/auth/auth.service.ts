import * as argon from 'argon2';

import { AuthDto } from './dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signup(dto: AuthDto) {
    // Generate the password

    // Save the new user in the
    return { msg: 'I have signed up' };
  }
  signin() {
    return { msg: 'I have signed in' };
  }
}
