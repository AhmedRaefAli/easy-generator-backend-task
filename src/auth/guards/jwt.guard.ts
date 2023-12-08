import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      if (!request.headers.authorization) {
        return false;
      }
      const jwtToken = request.headers.authorization.replace('Bearer ', '');
      const user = await this.jwtService.verifyAsync(jwtToken, {
        secret: process.env.JWT_SECRET,
      });
      request.user = user;
      return true;
    } catch (e) {
      return false;
    }
  }
}
