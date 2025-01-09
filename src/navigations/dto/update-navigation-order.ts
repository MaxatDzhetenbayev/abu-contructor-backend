import { isNumber, IsNumber, ValidateIf } from 'class-validator';

function IsNumberOrNull() {
  return ValidateIf((object, value) => value === null || isNumber(value));
}

export class UpdateNavigationOrderDto {
  @IsNumber()
  order: number;
  @IsNumber()
  id: number;
  @IsNumberOrNull()
  parent_id?: number | null;
}
