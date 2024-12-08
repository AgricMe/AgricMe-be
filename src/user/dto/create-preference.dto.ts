import { IsEnum, IsNotEmpty } from 'class-validator';
import { DateFormat, Default, Language, TimeZone } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePreferenceDto {
  @ApiProperty()
  @IsEnum(Language, {each: true})
  @IsNotEmpty()
  language: Language

  @ApiProperty()
  @IsEnum(TimeZone, {each: true})
  @IsNotEmpty()
  timeZone: TimeZone

  @ApiProperty()
  @IsEnum(DateFormat, {each: true})
  @IsNotEmpty()
  dateFormat: DateFormat

  @ApiProperty()
  @IsEnum(Default, {each: true})
  @IsNotEmpty()
  default: Default
}