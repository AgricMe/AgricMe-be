import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, UserResponseDto } from 'src/user/dto/signup-user.dto';
import { LoginDto } from 'src/user/dto/login-user.dto';
import { Response } from 'express';
import { Auth, IsPublic } from './guard/auth.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDocument } from 'src/user/schema/user.schema';
import { UtilService } from 'src/utils/utils.service';
import { GoogleOAuthGuard } from './guard/google-oauth.guard';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { FacebookAuthGuard } from './guard/facebook-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly utilService: UtilService,
    private readonly jwtService: JwtService,
  ) {}

  @IsPublic()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @ApiOperation({ summary: 'Register' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<Partial<UserDocument>> {
    signUpDto.password = await this.utilService.hashPassword(
      signUpDto.password,
    );
    return this.authService.register(signUpDto);
  }

  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const accessToken = await this.authService.login(loginDto);
    res.json({ accessToken });
  }

  @IsPublic()
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
  }

  @IsPublic()
  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Auth() user) {
    const payload = { email: user.email, sub: user._id };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @IsPublic()
  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookAuth() {
  }

  @IsPublic()
  @Get('facebook/redirect')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthRedirect(@Auth() user) {
    const payload = { email: user.email, sub: user._id };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
