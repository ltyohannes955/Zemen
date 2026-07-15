import { IsString, IsOptional, IsInt, Min, Max, IsArray, IsIn, IsObject, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['ethiopian', 'gregorian'] })
  @IsIn(['ethiopian', 'gregorian'])
  dateType: 'ethiopian' | 'gregorian';

  @ApiProperty()
  @IsInt()
  @Min(1)
  primaryYear: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(13)
  primaryMonth: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(30)
  primaryDay: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  secondaryYear: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(13)
  secondaryMonth: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(30)
  secondaryDay: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional({ enum: ['none', 'low', 'medium', 'high'] })
  @IsOptional()
  @IsIn(['none', 'low', 'medium', 'high'])
  priority?: string;

  @ApiPropertyOptional({ enum: ['pending', 'completed', 'cancelled'] })
  @IsOptional()
  @IsIn(['pending', 'completed', 'cancelled'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  recurrence?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  reminder?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateTaskDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['ethiopian', 'gregorian'])
  dateType?: 'ethiopian' | 'gregorian';

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  primaryYear?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(13)
  primaryMonth?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  primaryDay?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  secondaryYear?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(13)
  secondaryMonth?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  secondaryDay?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['none', 'low', 'medium', 'high'])
  priority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['pending', 'completed', 'cancelled'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  recurrence?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  reminder?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateStatusDto {
  @ApiProperty({ enum: ['pending', 'completed', 'cancelled'] })
  @IsIn(['pending', 'completed', 'cancelled'])
  status: string;
}

export class TaskQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['pending', 'completed', 'cancelled'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['none', 'low', 'medium', 'high'])
  priority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['ethiopian', 'gregorian'])
  dateType?: 'ethiopian' | 'gregorian';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dateTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  upcoming?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
