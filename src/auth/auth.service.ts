import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from 'src/user/dto/signup-user.dto';
import { LoginDto, SignInDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/user/schema/user.schema';
import { MailService } from 'src/mail/mail.service';
import { UtilService } from 'src/utils/utils.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private utilService: UtilService,
    private configService: ConfigService,
  ) {}

  async register(signUpDto: SignUpDto): Promise<Partial<UserDocument>> {
    const user = await this.userService.create(signUpDto);
    const updatedUser = await this.utilService.excludePassword(user);
    await this.mailService.sendMail({
      to: user.email,
      subject: 'AgricMe - Registration Successful',
      template: 'registration',
      context: {
        firstName: user.firstName,
      },
    });
    return updatedUser;
  }

  async login({
    loginDto,
    rememberMe,
  }: {
    loginDto: LoginDto;
    rememberMe: boolean;
  }): Promise<string> {
    const user: UserDocument = await this.userService.findUserByEmail(
      loginDto.email,
    );
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (!user.password) {
      throw new BadRequestException(
        'Unable to login, try signing in with your google account',
      );
    }

    const isMatch = await this.utilService.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }

    const rememberMeToken = await this.jwtService.signAsync(
      { ...user.toObject() },
      { expiresIn: '7d' },
    );
    const normalToken = await this.jwtService.signAsync({ ...user.toObject() });
    const token = rememberMe ? rememberMeToken : normalToken;
    return token;
  }

  async signInWithAccessToken(signInDto: SignInDto): Promise<string> {
    const payload = await this.jwtService.verifyAsync<UserDocument>(
      signInDto.access_token,
      {
        secret: this.configService.get<string>('jwtSecret'),
      },
    );
    const user: UserDocument = await this.userService.findUserByEmail(
      payload.email,
    );
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return await this.jwtService.signAsync({ ...user.toObject() });
  }
}
