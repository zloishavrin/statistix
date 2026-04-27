import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PaginationRequestDto {
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Page',
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @Min(1, {
    message: i18nValidationMessage('validation.min'),
  })
  @IsInt({ message: i18nValidationMessage('validation.isInteger'), })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  page: number = 1;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'Count elements in page',
    minimum: 2,
    maximum: 30,
    default: 7,
  })
  @Type(() => Number)
  @IsOptional()
  @Min(2, {
    message: i18nValidationMessage('validation.min'),
  })
  @Max(100, {
    message: i18nValidationMessage('validation.max'),
  })
  @IsInt({ message: i18nValidationMessage('validation.isInteger'), })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  limit: number = 7;
}
