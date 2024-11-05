import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async createSession(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ) {
    // Инвалидируем старую сессию, если она существует
    await this.sessionRepository.update({ userId }, { active: false });

    // Сохраняем новую сессию с accessToken и refreshToken
    await this.sessionRepository.save({
      userId,
      accessToken,
      refreshToken,
      active: true,
    });
  }

  async invalidateSession(refreshToken: string): Promise<void> {
    await this.sessionRepository.update({ refreshToken }, { active: false });
  }

  async findActiveSession(userId: number): Promise<Session | null> {
    return this.sessionRepository.findOne({ where: { userId, active: true } });
  }

  async findSessionByRefreshToken(
    refreshToken: string,
  ): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: { refreshToken, active: true },
    });
  }
}
