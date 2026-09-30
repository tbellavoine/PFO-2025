import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProjectLinkDto {
  @ApiProperty()
  @IsString()
  label!: string;

  @ApiProperty()
  @IsString()
  url!: string;
}
