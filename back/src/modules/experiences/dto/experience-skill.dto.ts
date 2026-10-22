import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ExperienceSkillDto {
  @ApiProperty()
  @IsUUID()
  skillId!: string;

  @ApiProperty()
  @IsUUID()
  categoryId!: string;
}
