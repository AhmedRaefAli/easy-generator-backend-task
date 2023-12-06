import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_HOST),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DB_HOST,
    //   port: +process.env.DB_PORT,
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_DATABASE,
    //   entities: [User],
    //   synchronize: true,
    // }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
