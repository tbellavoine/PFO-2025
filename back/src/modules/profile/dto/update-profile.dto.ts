import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  bioParagraphs!: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  softSkills!: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cvUrl?: string;
}
