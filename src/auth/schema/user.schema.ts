import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'users' })
export class UserDoc {
  _id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: '' })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDoc);
