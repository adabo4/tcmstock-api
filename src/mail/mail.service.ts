import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendPasswordResetEmail(email: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';

    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await this.resend.emails.send({
      from: 'noreply@tcm-api.mail.flights.home.sk',
      to: email,
      subject: 'Reset your password',
      html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset password</a>
      <p>This link expires in 30 minutes.</p>
    `,
    });
  }

  async sendVerificationEmail(email: string, code: string) {
    console.log('Sending verification email to:', email);
    const result = await this.resend.emails.send({
      from: 'noreply@tcm-api.mail.flights.home.sk',
      to: email,
      subject: 'Verify your account',
      html: `
       <h2>Welcome to TCM Stock</h2>

      <p>Your verification code is:</p>

      <h1>${code}</h1>

      <p>This code expires in 15 minutes.</p>
    `,
    });
    console.log(result);
  }

  async sendPasswordChangedEmail(email: string) {
    await this.resend.emails.send({
      from: 'noreply@tcm-api.mail.flights.home.sk',
      to: email,
      subject: 'Your password has been changed',
      html: `
      <h2>Password changed successfully</h2>

      <p>Your TCM Stock account password has been changed.</p>

      <p>If you made this change, no further action is required.</p>

      <p><strong>If you did not change your password, please reset it immediately or contact support.</strong></p>
    `,
    });
  }
}
