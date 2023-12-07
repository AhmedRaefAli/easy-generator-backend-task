import { Injectable } from '@nestjs/common';
import { RegisterDto } from './validators/register-validation';
import { UserRepository } from './auth.repository';
import { UserDoc } from './schema/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: RegisterDto): Promise<UserDoc> {
    return this.userRepository.createUser(data);
  }

  async findOne(condition: Partial<UserDoc>): Promise<UserDoc> {
    return this.userRepository.findOne(condition);
  }
}
