import { HttpException, HttpStatus, Injectable, MethodNotAllowedException, NotFoundException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // throw new HttpException("busy", HttpStatus.BAD_REQUEST)
    throw new NotFoundException()
    return 'Hello World!';
  }
}
