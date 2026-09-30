import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ExperienceSkillDto } from './experience-skill.dto.js';

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

  @ApiProperty({ description: 'Free text, e.g. "Oct 2020" or "Mai 2020 - Juin 2020"' })
  @IsString()
  periodLabel!: string;

  @ApiProperty({ description: 'Free text, e.g. "En cours" / "Terminée"' })
  @IsString()
  status!: string;

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
