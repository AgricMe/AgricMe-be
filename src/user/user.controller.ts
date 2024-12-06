import { Controller, Get, Param, Put, Body, Delete, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDocument } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth, Roles } from 'src/auth/guard/auth.decorator';
import { RoleNames } from './enums';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get Profile' })
  getUserProfile(@Auth() user: UserDocument) {
    const {
      _id,
      firstName,
      lastName,
      userName,
      email,
      profilePicture,
      bio,
      phoneNumber,
      location,
      job,
      interest,
      verificationStatus,
      role,
      __v,
    } = user;
    return {
      _id,
      firstName,
      lastName,
      userName,
      email,
      profilePicture,
      bio,
      phoneNumber,
      location,
      job,
      interest,
      verificationStatus,
      role,
      __v,
    };
  }

  @ApiBearerAuth()
  @Get()
  @Roles([RoleNames.ADMIN])
  @ApiOperation({ summary: 'Get Users' })
  async getAllUsers(): Promise<UserDocument[]> {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @Get(':userId')
  @ApiOperation({ summary: 'Get Single User' })
  async getUser(@Param('userId') userId: string): Promise<UserDocument> {
    return this.userService.findOne(userId);
  }

  @ApiBearerAuth()
  @Put(':userId')
  @Roles([RoleNames.BUYER, RoleNames.SELLER, RoleNames.SERVICE_PROVIDER])
  @ApiOperation({ summary: 'Update Profile' })
  updateUserProfile(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @ApiBearerAuth()
  @Post('company')
  @Roles([RoleNames.SELLER, RoleNames.SERVICE_PROVIDER])
  @ApiOperation({ summary: 'Create User Company' })
  createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    return this.userService.createUserCompany(createCompanyDto);
  }

  @ApiBearerAuth()
  @Get('company/:companyId')
  @Roles([RoleNames.SELLER, RoleNames.SERVICE_PROVIDER])
  @ApiOperation({ summary: 'Get User\'s Company Profile' })
  getCompanyProfile(
    @Param('companyId') companyId: string,
  ) {
    return this.userService.findUserCompany(companyId);
  }

  @ApiBearerAuth()
  @Put('company/:companyId')
  @Roles([RoleNames.SELLER, RoleNames.SERVICE_PROVIDER])
  @ApiOperation({ summary: 'Update User\'s Company Profile' })
  updateCompanyProfile(
    @Param('companyId') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.userService.updateUserCompany(companyId, updateCompanyDto);
  }

  @ApiBearerAuth()
  @Delete(':email')
  @Roles([RoleNames.BUYER, RoleNames.SELLER, RoleNames.SERVICE_PROVIDER])
  @ApiOperation({ summary: 'Delete User By Email' })
  deleteUserByEmail(@Param('email') email: string) {
    return this.userService.deleteUser(email);
  }
}
