import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any, @Res() response: Response) {
    const { username, password } = body;
    const admin = await this.authService.validateAdmin(username, password);

    const { accessToken } = await this.authService.login(admin);

    response
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      })
      .json({ message: 'Login successful' });
  }
}
