import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      console.log('JWT GUARD');
      const request = context.switchToHttp().getRequest();
      const jwtToken = request.headers.authorization.replace('Bearer ', '');
      const user = this.jwtService.verifyAsync(jwtToken, {
        secret: process.env.JWT_SECRET
      });
      request.user = user;
      return true;
    } catch (e) {
      return false;
    }
  }
}
