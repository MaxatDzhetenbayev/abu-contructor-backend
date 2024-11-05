import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth-dto';
import { UserResponse } from './interfaces/user.interface';
import { UserDto } from './dto/user-dto';
import { SessionService } from './session.service';
import { UserRole } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private sessionService: SessionService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Убедитесь, что значение роли берется из RegisterDto или устанавливается по умолчанию
    const user = await this.userRepository.save({
      username: registerDto.username,
      password: hashedPassword,
      role: registerDto.role || UserRole.USER,
    });

    return { id: user.id, username: user.username };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const payload = { username: user.username, sub: user.id };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      // Создание новой сессии с сохранением refreshToken
      await this.sessionService.createSession(
        user.id,
        accessToken,
        refreshToken,
      );

      return { accessToken, refreshToken };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async logout(refreshToken: string): Promise<void> {
    await this.sessionService.invalidateSession(refreshToken);
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      // Проверяем и извлекаем данные из refreshToken
      const payload = this.jwtService.verify(refreshToken);
      const session =
        await this.sessionService.findSessionByRefreshToken(refreshToken);

      // Проверка, активна ли сессия
      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        { username: payload.username, sub: payload.sub },
        { expiresIn: '1h' },
      );
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => ({
      id: user.id,
      username: user.username,
    }));
  }
}
