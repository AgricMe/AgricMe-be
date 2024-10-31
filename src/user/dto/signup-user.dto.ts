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
  @ApiProperty({ example: 'jane' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'janedoe123' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ example: 'janedoe@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'jane123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiProperty({ example: 'About yourself' })
  @IsString()
  @IsNotEmpty()
  bio: string;

  @ApiProperty({ example: '+2347020654422' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'Ibadan, Oyo State' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 'Irrigation Specialist' })
  @IsString()
  @IsNotEmpty()
  job: string;

  @ApiProperty({
    example: [
      Interests.SERVICE_PROVIDER,
      Interests.ANIMAL_PRODUCTION,
      Interests.FARMING,
    ],
  })
  @IsArray()
  @IsEnum([Interests], { each: true })
  @IsNotEmpty()
  interest: Interests[];

  @ApiProperty({ example: [RoleNames.SERVICE_PROVIDER] })
  @IsArray()
  @IsEnum([RoleNames], { each: true })
  @IsNotEmpty()
  role: RoleNames[];
}
