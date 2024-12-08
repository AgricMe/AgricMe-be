import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Interests, RoleNames } from '../enums';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  coverPhoto?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bio: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  job: string;

  @ApiProperty()
  @IsArray()
  @IsEnum(Interests, { each: true })
  @IsNotEmpty()
  interest: Interests[];

  @ApiProperty()
  @IsArray()
  @IsEnum(RoleNames, { each: true })
  @IsNotEmpty()
  role: RoleNames[];
}
