import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
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

  /*
   * this is and enpoint to Register new user to the system and encrypt the password in db
   */
  @Post('register')
  @ApiOkResponse({ description: 'registered' })
  async register(@Body() data: RegisterDto, @Res() response: Response) {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const Existuser = await this.AuthService.findOne({ email: data.email });

    if (Existuser) {
      throw new BadRequestException(['email must be unique']);
    }
    const user = await this.AuthService.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const userDto: UserDto = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    Logger.log(`new customer registered with id ${userDto.id}`)
    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Registered',
      data: userDto,
    });
  }

  /*
   * this is and enpoint to login the user on system and send jwt token
   */
  @Post('login')
  @ApiOkResponse({ description: 'loggedIn' })
  async login(@Body() data: LoginDto, @Res() response: Response) {
    const user = await this.AuthService.findOne({ email: data.email });

    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new BadRequestException('invalid credentials');
    }

    const jwt = await this.jwtService.signAsync(
      { id: user._id },
      { expiresIn: '1h', secret: process.env.JWT_SECRET },
    );

    const refreshToken = await this.jwtService.signAsync(
      { id: user._id },
      { expiresIn: '7d', secret: process.env.JWT_SECRET_REF },
    );

    this.AuthService.updateUser(user._id, {
      ...user,
      refreshToken: refreshToken,
    });

    const userDto: UserDto = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    Logger.log(`new customer logged in with id ${userDto.id}`)

    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'loggedIn',
      data: {
        user: userDto,
        token: jwt,
        refreshToken,
      },
    });
  }

  /*
   * this is and enpoint to get cuurent user data
   * with authenticated guard to be used by only logged in user
   */
  @UseGuards(JWTGuard)
  @Get('user')
  @ApiOkResponse({ description: 'current user' })
  async user(@Req() request: Request, @Res() response: Response) {
    try {

      const user = await this.AuthService.findOne({ _id: request['user'].id });
      const userDto: UserDto = {
        id: user._id,
        name: user.name,
        email: user.email,
      };
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'current user',
        data: {
          user: userDto,
        },
      });
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  // 1- regenerate access token from refresh token
  @Post('refresh')
  @ApiOkResponse({ description: 'Access token refreshed successfully' })
  async refresh(
    @Body() data: { refreshToken: string },
    @Res() response: Response,
  ) {
    try {
      const decodedRefreshToken = await this.jwtService.verifyAsync(
        data.refreshToken,
        {
          secret: process.env.JWT_SECRET,
        },
      );

      const user = await this.AuthService.findOne({
        _id: decodedRefreshToken.id,
      });

      if (!user || user.refreshToken !== data.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.jwtService.signAsync(
        { id: user._id },
        { expiresIn: '1h', secret: process.env.JWT_SECRET },
      );

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Access token refreshed successfully',
        data: {
          token: newAccessToken,
        },
      });
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  /*
   * 2- this is and enpoint to logout the userby deleting refresh token form user
   */
  @Post('logout')
  @UseGuards(JWTGuard)
  @ApiOkResponse({ description: 'Logged out successfully' })
  async logout(@Req() request: Request, @Res() response: Response) {
    const user = await this.AuthService.findOne({ _id: request['user'].id });
    if (!user) {
      throw new BadRequestException(['invalid user']);
    }
    this.AuthService.updateUser(user._id, {
      ...user,
      refreshToken: null,
    }).catch(err=>{
      throw new BadRequestException(['faild to log out']);
    });

    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Logged out successfully',
    });
  }
}
