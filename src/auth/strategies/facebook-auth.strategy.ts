import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FacebookAuthStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get<string>('facebookAppId'),
      clientSecret: configService.get<string>('facebookAppSecret'),
      callbackURL: configService.get<string>('facebookCallBackUrl'),
      scope: ['email', 'public_profile'],
      profileFields: ['name', 'photos']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: any): Promise<any> {
    const user = await this.userService.facebookAuthFindOrCreate(profile);

    done(null, user);
  }
}
