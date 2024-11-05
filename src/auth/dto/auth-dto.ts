import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class RegisterDto {
  @ApiProperty({ description: 'Username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.USER;
}

export class LoginDto {
  @ApiProperty({ description: 'Username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  password: string;
}
