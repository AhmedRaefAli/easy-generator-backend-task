import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './validators/register-validation';
import { UserDto } from './dto/user.dto';
import { error } from 'console';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(protected dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(userDto: RegisterDto): Promise<UserDto> {
    const user = await super.save(super.create({ ...userDto })).catch(error=>{
      throw new BadRequestException(error.message)
    });
    return user;
  }

  async findOne(condition: Partial<FindOneOptions<User>>): Promise<User> {
    return super.findOne(condition);
  }
}
