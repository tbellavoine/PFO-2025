import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Company } from '../enums/company.enum.js';
import { ProjectCategory } from '../enums/project-category.enum.js';
import { ProjectType } from '../enums/project-type.enum.js';
import { ProjectStatus } from '../enums/project-status.enum.js';
import { ProjectLinkDto } from './project-link.dto.js';

export class CreateProjectDto {
  @ApiProperty({ description: 'First day of the start month, e.g. "2020-10-01"' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ required: false, description: 'First day of the end month, or omitted if ongoing' })
  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ enum: Company })
  @IsEnum(Company)
  company!: Company;

  @ApiProperty({ enum: ProjectCategory })
  @IsEnum(ProjectCategory)
  category!: ProjectCategory;

  @ApiProperty({ enum: ProjectType })
  @IsEnum(ProjectType)
  type!: ProjectType;

  @ApiProperty({ enum: ProjectStatus })
  @IsEnum(ProjectStatus)
  status!: ProjectStatus;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiProperty({ type: [String], description: 'Skill catalog IDs (GET /v1/admin/skills to list them)' })
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  skillIds!: string[];

  @ApiProperty({ type: [ProjectLinkDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectLinkDto)
  links!: ProjectLinkDto[];

  @ApiProperty({ required: false, description: 'Media ID, see /v1/admin/media' })
  @IsOptional()
  @IsUUID()
  previewImageId?: string;
}
