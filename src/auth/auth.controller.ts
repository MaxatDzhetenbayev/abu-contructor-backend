import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth-dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user-dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth') // Тег для группировки
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully.' }) // Ответ на успешную регистрацию
  @ApiResponse({ status: 400, description: 'Invalid data.' }) // Ответ на ошибку
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'Login successful.', type: String }) // Успешный ответ при логине
  @ApiResponse({ status: 401, description: 'Invalid credentials.' }) // Ответ на ошибку логина
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  @ApiBearerAuth() // Указывает, что требуется Bearer Token
  @ApiResponse({ status: 200, description: 'List of users.', type: [UserDto] }) // Успешный ответ с пользователями
  @ApiResponse({ status: 401, description: 'Unauthorized.' }) // Ответ на ошибку доступа
  async getUsers(): Promise<UserDto[]> {
    return this.authService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Request() req) {
    const token = req.headers.authorization.split(' ')[1]; // Получите токен из заголовка
    return this.authService.logout(token);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: { refreshToken: string }) {
    return this.authService.refreshAccessToken(refreshDto.refreshToken);
  }
}

