import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { AnswerType, AppealType } from '../entities/appeal.entity';

export class CreateAppealDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('KZ')
  phone?: string;

  @IsOptional()
  @IsEnum(AnswerType)
  answer_type?: AnswerType;

  @IsEnum(AppealType)
  appeal_type: AppealType;

  @IsString()
  text: string;
}

