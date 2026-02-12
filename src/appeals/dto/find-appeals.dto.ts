import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  IsBooleanString,
  IsISO8601,
} from 'class-validator';
import { AppealType } from '../entities/appeal.entity';

export class FindAppealsDto {

  @ValidateIf((o) => o.to !== undefined)
  @IsNotEmpty({ message: 'Дата начала периода обязательна' })
  @IsISO8601({}, { message: 'Дата начала периода должна быть в формате ISO 8601' })
  from?: string;


  @IsOptional()
  @IsISO8601({}, { message: 'Дата окончания периода должна быть в формате ISO 8601' })
  to?: string;


  @IsOptional()
  @IsEnum(AppealType)
  appeal_type?: AppealType;


  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsBooleanString()
  is_checked?: string;
}

