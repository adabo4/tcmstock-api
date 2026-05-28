import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your password',
      html: `
        <p>Click the link below to reset your password:</p>

        <a href="${resetLink}">
          Reset password
        </a>
      `,
    });
  }
}
