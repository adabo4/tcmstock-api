import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateNameDto } from './dto/change-name.dto';
import { VerifyEmailDTO } from './dto/verify-email.dto';
import { ResendVerificationCodeDto } from './dto/resend-verification-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDTO) {
    return this.authService.verifyEmail(dto);
  }

  @Post('resend-verification-code')
  resendVerificationCode(@Body() dto: ResendVerificationCodeDto) {
    return this.authService.resendVerificationCode(dto.email);
  }

  @Patch('change-password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.userId, dto);
  }

  @Patch('me/name')
  @UseGuards(AuthGuard('jwt'))
  updateName(@Req() req: AuthenticatedRequest, @Body() dto: UpdateNameDto) {
    return this.authService.updateName(req.user.userId, dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  deleteMe(@Req() req: AuthenticatedRequest) {
    return this.authService.deleteUser(req.user.userId);
  }
}
