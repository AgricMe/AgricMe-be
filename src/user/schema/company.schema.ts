import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Interests, RoleNames, VerificationStatus } from '../enums';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true, unique: true })
  companyName: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  area: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  CACNumber: string;

  @Prop({})
  countryCode: string;

  @Prop({})
  phoneNumber: string;

  @Prop({
    required: true,
  })
  address: string;

  @Prop({
    type: Types.ObjectId, ref: 'User'
  })
  owner: User;
}

export type CompanyDocument = HydratedDocument<Company>;
export const CompanySchema = SchemaFactory.createForClass(Company);
