import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto : AuthDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  async signIn(@Body() dto : AuthDto) {
    return this.authService.login(dto);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    const tokenData = await this.authService.callback(code);
    if (tokenData) {
        res.redirect(`http://localhost:3000/?token=${tokenData.access_token}`);
    } else {
        res.redirect(`http://localhost:3000/`);
    }
  }
}
