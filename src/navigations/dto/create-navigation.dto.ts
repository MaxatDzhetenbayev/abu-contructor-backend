import { isNumber, IsObject, IsString, ValidateIf } from 'class-validator';

function IsNumberOrNull() {
  return ValidateIf((object, value) => value === null || isNumber(value));
}

export class CreateNavigationDto {
  @IsObject()
  title: {
    [key: string]: string;
  };

  @IsString()
  slug: string;

  @IsNumberOrNull()
  parent_id: number | null;

  @IsString()
  navigation_type: string;
}
