import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsUUID } from 'class-validator';
import { SkillLevel } from '../entities/skill-level.enum.js';

export class UpsertSkillEntryDto {
  @ApiProperty()
  @IsUUID()
  skillId!: string;

  @ApiProperty({ enum: SkillLevel })
  @IsEnum(SkillLevel)
  level!: SkillLevel;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;
}
