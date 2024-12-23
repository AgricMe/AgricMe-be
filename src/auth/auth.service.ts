import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from 'src/user/dto/signup-user.dto';
import { LoginDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/user/schema/user.schema';
import { MailService } from 'src/mail/mail.service';
import { UtilService } from 'src/utils/utils.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private utilService: UtilService,
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

  async login(loginDto: LoginDto): Promise<string> {
    const user: UserDocument = await this.userService.findUserByEmail(
      loginDto.email,
    );
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if(!user.password){
      throw new BadRequestException('Unable to login, try signing in with your google account');
    }
    
    const isMatch = await this.utilService.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }
    return await this.jwtService.signAsync({ ...user.toObject() });
  }
}
