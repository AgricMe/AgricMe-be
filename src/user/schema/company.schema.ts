import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserDocument } from './user.schema';

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  area: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  CACNumber: string;

  @Prop({required: true})
  countryCode: string;

  @Prop({required: true})
  phoneNumber: string;

  @Prop({
    required: true,
  })
  address: string;

  @Prop({
    type: Types.ObjectId, ref: 'User'
  })
  owner: UserDocument;
}

export type CompanyDocument = HydratedDocument<Company>;
export const CompanySchema = SchemaFactory.createForClass(Company);
