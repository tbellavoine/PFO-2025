import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateContactDto {
  @ApiProperty()
  @IsString()
  site!: string;

  @ApiProperty()
  @IsString()
  email!: string;

  @ApiProperty()
  @IsString()
  linkedin!: string;
}
