import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { passwordResetTemplate } from './templates/password-reset';
import { verificationTemplate } from './templates/verification';
import { passwordChangedTemplate } from './templates/password-changed';

@Injectable()
export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendPasswordResetEmail(email: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';

    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await this.resend.emails.send({
      from: 'noreply@tcm-api.mail.flights.home.sk',
      to: email,
      subject: 'Obnovte svoje heslo',
      html: passwordResetTemplate(resetLink),
    });
  }

  async sendVerificationEmail(email: string, code: string) {
    console.log('Sending verification email to:', email);
    const result = await this.resend.emails.send({
      from: 'noreply@tcm-api.mail.flights.home.sk',
      to: email,
      subject: 'Overenie účtu pri registrácii',
      html: verificationTemplate(code),
    });
    console.log(result);
  }

  async sendPasswordChangedEmail(email: string) {
    await this.resend.emails.send({
      from: 'noreply@tcm-api.mail.flights.home.sk',
      to: email,
      subject: 'Vaše heslo bolo zmenené',
      html: passwordChangedTemplate(),
    });
  }
}
