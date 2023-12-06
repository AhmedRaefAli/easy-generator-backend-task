import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './auth.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDoc, UserSchema } from './schema/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserDoc.name, schema: UserSchema }]),
    // TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
