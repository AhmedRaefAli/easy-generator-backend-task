import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { RegisterDto } from './validators/register-validation';
import { UserRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async create(data: RegisterDto): Promise<UserDto> {
    return this.userRepository.createUser(data);
  }

  async findOne(
    condition: Partial<FindOneOptions<User>>,
  ): Promise<User> {
    return this.userRepository.findOne(condition);
  }
}
