import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from 'src/common/types/login.dto';
import { Public } from './meta';

@Controller('/api/v1/auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async signIn(@Body() loginDto: LoginDto) {
    return this.authService.authenticate(loginDto.email, loginDto.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
