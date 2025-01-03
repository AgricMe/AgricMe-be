import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';
import { UtilModule } from 'src/utils/utils.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleOAuthStrategy } from './strategies/google-oauth.strategy';
import { FacebookAuthStrategy } from './strategies/facebook-auth.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          global: true,
          secret: configService.get<string>('jwtSecret'),
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
    UtilModule,
    UserModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleOAuthStrategy, FacebookAuthStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
