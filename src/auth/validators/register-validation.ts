import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { PasswordStrength } from './strongpassword';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'email must be an valid email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @PasswordStrength()
  password: string;
}
