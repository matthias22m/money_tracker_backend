import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create(registerDto);

      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = verificationToken;
      await this.usersService.update(user.id, { verificationToken });

      await this.sendVerificationEmail(user.email, verificationToken);

      return {
        message:
          'Registration successful. Please check your email to verify your account.',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Registration failed');
    }
  }

  private async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}/auth/verify-email?token=${token}`;
    await this.mailService.sendMail({
      to: email,
      subject: 'Welcome to Money Tracker! Confirm your Email',
      html: `Please click this link to confirm your email: <a href="${verificationUrl}">${verificationUrl}</a>`,
    });
  }

  async requestEmailChange(userId: string, newEmail: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const emailChangeToken = crypto.randomBytes(32).toString('hex');
    await this.usersService.update(userId, { 
      newEmail,
      emailChangeToken 
    });

    await this.sendEmailChangeVerification(newEmail, emailChangeToken);

    return { message: 'Verification email sent to your new email address.' };
  }

  private async sendEmailChangeVerification(email: string, token: string) {
    const verificationUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}/auth/verify-email-change?token=${token}`;
    await this.mailService.sendMail({
      to: email,
      subject: 'Confirm Your New Email Address',
      html: `Please click this link to confirm your new email address: <a href="${verificationUrl}">${verificationUrl}</a>`,
    });
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal that the user doesn't exist
      return { message: 'If a user with that email exists, a password reset link has been sent.' };
    }

    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await this.usersService.update(user.id, {
      passwordResetToken,
      passwordResetExpires,
    });

    await this.sendPasswordResetEmail(user.email, passwordResetToken);

    return { message: 'If a user with that email exists, a password reset link has been sent.' };
  }

  private async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}/auth/reset-password?token=${token}`;
    await this.mailService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `Please click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`,
    });
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByPasswordResetToken(token);

    if (!user || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.update(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    return { message: 'Password has been reset successfully.' };
  }

  async verifyEmailChange(token: string) {
    const user = await this.usersService.findByEmailChangeToken(token);

    if (!user) {
      throw new NotFoundException('Invalid verification token.');
    }

    await this.usersService.update(user.id, {
      email: user.newEmail,
      newEmail: null,
      emailChangeToken: null,
    });

    return { message: 'Email address changed successfully.' };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);

    if (!user) {
      throw new NotFoundException('Invalid verification token.');
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    await this.usersService.update(user.id, { isEmailVerified: true, verificationToken: null });

    return { message: 'Email verified successfully.' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException('Please verify your email before logging in.');
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.username, user.email);
    await this.usersService.setCurrentRefreshToken(tokens.refreshToken, user.id);
    return tokens;
  }

  async getTokens(userId: string, username: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username, email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, username, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const userId = decoded.sub;
      const user = await this.usersService.findOne(userId);
      if (!user || !user.currentHashedRefreshToken) {
        throw new UnauthorizedException('Access Denied');
      }

      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.currentHashedRefreshToken,
      );

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Access Denied');
      }

      const tokens = await this.getTokens(user.id, user.username, user.email);
      await this.usersService.setCurrentRefreshToken(tokens.refreshToken, user.id);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
