import { Controller, Get, Param, Put, Body, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDocument } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth, Roles } from 'src/auth/guard/auth.decorator';
import { RoleNames } from './enums';

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
  @Delete(':email')
  @Roles([RoleNames.BUYER, RoleNames.SELLER, RoleNames.SERVICE_PROVIDER])
  @ApiOperation({ summary: 'Delete User By Email' })
  deleteUserByEmail(@Param('email') email: string) {
    return this.userService.deleteUser(email);
  }
}
