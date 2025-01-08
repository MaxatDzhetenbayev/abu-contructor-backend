import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Auth } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth)
    private authRepository: typeof Auth,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(username: string, password: string) {
    const user = await this.authRepository.findOne({
      where: { username },
    });
    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException('Invalid credentials or not an admin');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(admin: Auth) {
    const payload = { sub: admin.id, role: admin.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
