import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Interests, RoleNames, VerificationStatus } from '../enums';
import { Company, CompanyDocument } from './company.schema';
import { Preference, PreferenceDocument } from './preferences.schema';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({
    default:
      'https://res.cloudinary.com/dynopc0cn/image/upload/v1728734784/avatar_ym1ctb.jpg',
  })
  profilePicture: string;

  @Prop({})
  coverPhoto: string;

  @Prop({})
  bio: string;

  @Prop({})
  phoneNumber: string;

  @Prop({
    // required: true,
  })
  location: string;

  @Prop({
  })
  address: string;

  @Prop({
  })
  zipCode: string;

  @Prop({
    // required: true,
  })
  job: string;

  @Prop({
    type: Types.ObjectId, ref: Company.name
  })
  company?: CompanyDocument;

  @Prop({
    type: Types.ObjectId, ref: Preference.name
  })
  preference: PreferenceDocument;

  @Prop({
    type: [String],
    required: true,
    enum: Object.values(Interests),
  })
  interest: Interests[];

  @Prop({ default: VerificationStatus.PENDING })
  verificationStatus: VerificationStatus;

  @Prop({
    type: [String],
    required: true,
    enum: Object.values(RoleNames),
  })
  role: RoleNames[];
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
