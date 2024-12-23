import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Company, CompanySchema } from './schema/company.schema';
import { UtilModule } from 'src/utils/utils.module';
import { Preference, PreferenceSchema } from './schema/preferences.schema';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Company.name,
        schema: CompanySchema,
      }, 
      {
        name: Preference.name,
        schema: PreferenceSchema
      }
    ]),
    UtilModule,
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
