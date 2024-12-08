import { Controller, Get, Param, Body, Delete, Post, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDocument } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth, Roles } from 'src/auth/guard/auth.decorator';
import { RoleNames } from './enums';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get Profile' })
  async getUserProfile(@Auth() user: UserDocument) {
    return await this.userService.findOne(user?._id.toString());
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
  @Patch(':userId')
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
    @Auth() user: UserDocument,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    return this.userService.createUserCompany(user,createCompanyDto);
  }

  @ApiBearerAuth()
  @Get('company/profile')
  @Roles([RoleNames.SELLER, RoleNames.SERVICE_PROVIDER])
  @ApiOperation({ summary: 'Get User\'s Company Profile' })
  getCompanyProfile(
    @Auth() user: UserDocument,
  ) {
    return this.userService.findUserCompany(user);
  }

  @ApiBearerAuth()
  @Patch('company/profile')
  @Roles([RoleNames.SELLER, RoleNames.SERVICE_PROVIDER])
  @ApiOperation({ summary: 'Update User\'s Company Profile' })
  updateCompanyProfile(
    @Auth() user: UserDocument,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.userService.updateUserCompany(user, updateCompanyDto);
  }

  @ApiBearerAuth()
  @Post('change-email')
  @Roles([RoleNames.BUYER,RoleNames.SELLER, RoleNames.SERVICE_PROVIDER])
  @ApiOperation({ summary: 'Change Email' })
  changeEmail(
    @Auth() user: UserDocument,
    @Body() changeEmailDto: ChangeEmailDto,
  ) {
    return this.userService.changeEmail(user,changeEmailDto);
  }

  @ApiBearerAuth()
  @Post('change-password')
  @Roles([RoleNames.BUYER,RoleNames.SELLER, RoleNames.SERVICE_PROVIDER])
  @ApiOperation({ summary: 'Change Password' })
  changePassword(
    @Auth() user: UserDocument,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user,changePasswordDto);
  }

  @ApiBearerAuth()
  @Post('preference')
  @Roles([RoleNames.BUYER,RoleNames.SELLER, RoleNames.SERVICE_PROVIDER])
  @ApiOperation({ summary: 'Create User Preference' })
  createPreference(
    @Auth() user: UserDocument,
    @Body() createPreferenceDto: CreatePreferenceDto,
  ) {
    return this.userService.createUserPreference(user,createPreferenceDto);
  }

  @ApiBearerAuth()
  @Patch('/preference/update')
  @Roles([RoleNames.BUYER,RoleNames.SELLER, RoleNames.SERVICE_PROVIDER])
  @ApiOperation({ summary: 'Update User Preference' })
  updatePreference(
    @Auth() user: UserDocument,
    @Body() updatePreferenceDto: UpdatePreferenceDto,
  ) {
    return this.userService.updateUserPreference(user, updatePreferenceDto);
  }

  @ApiBearerAuth()
  @Delete(':email')
  @Roles([RoleNames.BUYER, RoleNames.SELLER, RoleNames.SERVICE_PROVIDER])
  @ApiOperation({ summary: 'Delete User By Email' })
  deleteUserByEmail(@Param('email') email: string) {
    return this.userService.deleteUser(email);
  }
}
