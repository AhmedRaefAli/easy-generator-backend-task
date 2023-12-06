import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { LoginDto } from './validators/login-validator';
import { RegisterDto } from './validators/register-validation';
import { UserDto } from './dto/user.dto';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly AuthService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  @ApiOkResponse({ description: 'registered' })
  async register(@Body() data: RegisterDto, @Res() response: Response) {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const Existuser = await this.AuthService.findOne({
      where: { email: data.email },
    });

    if(Existuser){
      throw new BadRequestException(['email must be unique'])
    }
    const user = await this.AuthService.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Registered',
      data: user as UserDto,
    });
  }

  @Post('login')
  @ApiOkResponse({ description: 'loggedIn' })
  async login(
    @Body() data: LoginDto,
    @Res() response: Response,
  ) {
    const user = await this.AuthService.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new BadRequestException('invalid credentials');
    }

    const jwt = await this.jwtService.signAsync(
      { id: user.id },
      { expiresIn: '1h', secret: process.env.JWT_SECRET },
    );
    console.log('here')
    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'loggedIn',
      data: {
        user: user as UserDto,
        token: jwt,
      },
    });
  }

  @UseGuards(JWTGuard)
  @Get('user')
  @ApiOkResponse({ description: 'current user' })
  async user(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const user = await this.AuthService.findOne({
        where: { id: request['user'].id },
      });

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'current user',
        data: {
          user: user as UserDto,
        },
      });
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  @Post('logout')
  @ApiOkResponse()
  async logout(@Res() response: Response) {
    //delete refresh token
    return {
      message: 'success',
    };
  }
}
