import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'prisma/prisma.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { randomBytes } from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';
import { UpdateNameDto } from './dto/change-name.dto';
import { VerifyEmailDTO } from './dto/verify-email.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser && existingUser.isVerified) {
      throw new BadRequestException('User already exists');
    }

    if (existingUser && existingUser.isVerified) {
      throw new BadRequestException('User already exists');
    }

    if (existingUser && !existingUser.isVerified) {
      const code = this.generateVerificationCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await this.prisma.$transaction(async (tx) => {
        const stockLocation = await tx.stockLocation.findFirst({
          where: {
            userId: existingUser.id,
          },
        });

        if (!stockLocation) {
          await tx.stockLocation.create({
            data: {
              name: 'Hlavný sklad',
              isDefault: true,
              userId: existingUser.id,
            },
          });
        }

        await tx.verificationCode.upsert({
          where: {
            userId: existingUser.id,
          },
          update: {
            code,
            expiresAt,
          },
          create: {
            code,
            userId: existingUser.id,
            expiresAt,
          },
        });
      });

      await this.mailService.sendVerificationEmail(existingUser.email, code);

      return {
        message: 'Verification code sent again',
        email: existingUser.email,
      };
    }

    const passwordHash = await bcrypt.hash(dto.password.trim(), 10);
    const code = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          name: dto.name.trim(),
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      await tx.stockLocation.create({
        data: {
          name: 'Hlavný sklad',
          isDefault: true,
          userId: createdUser.id,
        },
      });

      await tx.verificationCode.create({
        data: {
          code,
          userId: createdUser.id,
          expiresAt,
        },
      });

      return createdUser;
    });

    await this.mailService.sendVerificationEmail(user.email, code);

    return {
      message: 'Verification code sent',
      email: user.email,
    };
  }
  // async login(dto: LoginDto) {
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       email: dto.email,
  //     },
  //   });

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   if (!user.isVerified) {
  //     throw new UnauthorizedException('Please verify your email first');
  //   }

  //   const isPasswordValid = await bcrypt.compare(
  //     dto.password,
  //     user.passwordHash,
  //   );

  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   const payload = {
  //     sub: user.id,
  //     email: user.email,
  //   };

  //   const accessToken = await this.jwtService.signAsync(payload);

  //   return {
  //     message: 'User logged in successfully',
  //     accessToken,
  //     user: {
  //       id: user.id,
  //       email: user.email,
  //       name: user.name,
  //     },
  //   };
  // }

  async login(dto: LoginDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new ForbiddenException({
        message: 'Your email is not verified.',
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email,
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'User logged in successfully',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    try {
      await this.mailService.sendPasswordChangedEmail(user.email);
    } catch (error) {
      console.error('Failed to send password changed email', error);
    }

    return {
      message: 'Password changed successfully',
    };
  }

  async updateName(userId: number, dto: UpdateNameDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return {
      message: 'Name updated successfully',
      user,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Bezpečnostne v produkcii neprezrádzame, či email existuje.
    if (!user) {
      return {
        message: 'If this email exists, a password reset link will be sent.',
      };
    }

    const token = randomBytes(32).toString('hex');

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    await this.prisma.passwordResetToken.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    });

    // return {
    //   message: 'Password reset token created',
    //   resetToken: token, // len počas developmentu
    // };

    await this.mailService.sendPasswordResetEmail(user.email, token);

    return {
      message: 'Password reset email sent',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
      include: { user: true },
    });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    });

    await this.prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    return {
      message: 'Password reset successfully',
    };
  }

  async verifyEmail(dto: VerifyEmailDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const verification = await this.prisma.verificationCode.findUnique({
      where: { userId: user.id },
    });

    if (!verification) {
      throw new BadRequestException('Verification code not found');
    }

    if (verification.code !== dto.code) {
      throw new BadRequestException('Invalid verification code');
    }

    if (verification.expiresAt < new Date()) {
      throw new BadRequestException('Verification code expired');
    }
    const verifiedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    await this.prisma.verificationCode.delete({
      where: { userId: user.id },
    });

    const payload = {
      sub: verifiedUser.id,
      email: verifiedUser.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Email verified successfully',
      accessToken,
      user: {
        id: verifiedUser.id,
        email: verifiedUser.email,
        name: verifiedUser.name,
      },
    };
  }

  async resendVerificationCode(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const code = this.generateVerificationCode();

    await this.prisma.verificationCode.upsert({
      where: {
        userId: user.id,
      },
      update: {
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
      create: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await this.mailService.sendVerificationEmail(user.email, code);

    return {
      message: 'A new verification code has been sent.',
      email: user.email,
    };
  }

  async deleteUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return {
      message: 'User deleted.',
    };
  }

  private generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
