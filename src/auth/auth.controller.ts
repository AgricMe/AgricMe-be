import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, UserResponseDto } from 'src/user/dto/signup-user.dto';
import { LoginDto, SignInDto } from 'src/user/dto/login-user.dto';
import { Response } from 'express';
import { Auth, IsPublic } from './guard/auth.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDocument } from 'src/user/schema/user.schema';
import { UtilService } from 'src/utils/utils.service';
import { GoogleOAuthGuard } from './guard/google-oauth.guard';
import { JwtService } from '@nestjs/jwt';
import { FacebookAuthGuard } from './guard/facebook-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly utilService: UtilService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
  async login(
    @Res() res: Response,
    @Body() loginDto: LoginDto,
    @Query('rememberMe') rememberMe: boolean,
  ) {
    const access_token = await this.authService.login({ loginDto, rememberMe });
    res.cookie('access_token', access_token, {
      maxAge: rememberMe ? 604800000 : 86400000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.json({
      message: 'Login successful',
    });
  }

  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Post('access_token-signIn')
  @ApiOperation({ summary: 'SignIn with access_token' })
  async signInWithAccessToken(
    @Res() res: Response,
    @Body() signInDto: SignInDto,
  ) {
    const access_token =
      await this.authService.signInWithAccessToken(signInDto);
    res.cookie('access_token', access_token, {
      maxAge: 86400000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.json({
      message: 'SignIn successful',
    });
  }

  @IsPublic()
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @IsPublic()
  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Auth() user, @Res() res: Response) {
    const userPayload = { ...user.toObject() };
    const access_token = await this.jwtService.signAsync(
      {
        email: userPayload.email,
      },
      { expiresIn: '1m' },
    );

    res.redirect(
      `${this.configService.get<string>('frontendUrl')}/google-auth/callback?access_token=${access_token}`,
    );
  }

  @IsPublic()
  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookAuth() {}

  @IsPublic()
  @Get('facebook/redirect')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthRedirect(@Auth() user, @Res() res: Response) {
    const userPayload = { ...user.toObject() };
    const access_token = await this.jwtService.signAsync(
      {
        email: userPayload.email,
      },
      { expiresIn: '1m' },
    );

    return res.redirect(
      `${this.configService.get<string>('frontendUrl')}/google-auth/callback?access_token=${access_token}`,
    );
  }
}
