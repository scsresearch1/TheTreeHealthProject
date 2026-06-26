import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto) {
    // Placeholder — replace with Firebase Auth / database lookup
    if (!dto.email || !dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = {
      id: '1',
      email: dto.email,
      name: dto.email.split('@')[0],
      role: 'researcher',
    };

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, accessToken };
  }
}
