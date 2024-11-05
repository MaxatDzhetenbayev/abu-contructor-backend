import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: 'Username of the user' })
  username: string;
}
