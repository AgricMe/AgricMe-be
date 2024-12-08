import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserDocument } from './user.schema';
import { DateFormat, Default, Language, TimeZone } from '../enums';

@Schema({ timestamps: true })
export class Preference {
  @Prop({
    type: String,
    required: true,
    enum: Object.values(Language),
    default: Language.ENGLISH
  })
  language: Language;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(TimeZone),
    default: TimeZone.GMT_PLUS_5_30
  })
  timeZone: TimeZone;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(DateFormat),
    default: DateFormat.NO_PREFERENCE
  })
  dateFormat: DateFormat;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(Default),
    default: Default.OFF
  })
  default: Default;

  @Prop({
    type: Types.ObjectId, ref: 'User'
  })
  user: UserDocument;
}

export type PreferenceDocument = HydratedDocument<Preference>;
export const PreferenceSchema = SchemaFactory.createForClass(Preference);
