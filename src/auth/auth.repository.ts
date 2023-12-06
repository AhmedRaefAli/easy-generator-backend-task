import { Injectable } from '@nestjs/common';
import { RegisterDto } from './validators/register-validation';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserDoc } from './schema/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(UserDoc.name) private catModel: Model<UserDoc>) {}

  async createUser(createCatDto: RegisterDto): Promise<UserDoc> {
    const createdCat = new this.catModel({
      ...createCatDto,
      _id: new mongoose.Types.ObjectId(),
    });
    return createdCat.save();
  }

  async findOne(condition: Partial<UserDoc>): Promise<UserDoc> {
    const createdCat = this.catModel.findOne(condition);
    return createdCat;
  }
}
