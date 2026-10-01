import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ExperienceSkillDto } from './experience-skill.dto.js';
import { ExperienceStatus } from '../enums/experience-status.enum.js';

export class CreateExperienceDto {
  @ApiProperty()
  @IsString()
  slug!: string;

  @ApiProperty()
  @IsString()
  company!: string;

  @ApiProperty()
  @IsString()
  role!: string;

  @ApiProperty({ description: 'First day of the start month, e.g. "2020-10-01"' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ required: false, description: 'First day of the end month, or omitted if ongoing' })
  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @ApiProperty({ enum: ExperienceStatus })
  @IsEnum(ExperienceStatus)
  status!: ExperienceStatus;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  achievements!: string[];

  @ApiProperty({ type: [ExperienceSkillDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceSkillDto)
  skills!: ExperienceSkillDto[];
}
