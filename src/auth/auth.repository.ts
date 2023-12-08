import { Injectable } from '@nestjs/common';
import { RegisterDto } from './validators/register-validation';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserDoc } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(UserDoc.name) private userModel: Model<UserDoc>) {}

  async createUser(createUserDto: RegisterDto): Promise<UserDoc> {
    const createdUser = new this.userModel({
      ...createUserDto,
      _id: new mongoose.Types.ObjectId(),
    });
    return createdUser.save();
  }

  async findOne(condition: Partial<UserDoc>): Promise<UserDoc | null> {
    return this.userModel.findOne(condition).exec();
  }

  async updateUser(
    userId: string,
    updateUserDto: Partial<RegisterDto>,
  ): Promise<UserDoc | null> {
    return this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .exec();
  }

  async deleteUser(userId: string) {
    return this.userModel.findByIdAndDelete(userId).exec();
  }
}
