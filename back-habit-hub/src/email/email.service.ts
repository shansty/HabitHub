import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendVerificationEmail(to: string, code: string) {
    const verifyUrl = `http://localhost:5173/verify-email?code=${code}`;
    await this.transporter.sendMail({
      from: `"HabitHub" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Confirm your email',
      html: `<p>Click to confirm your email:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
    });
  }

  async sendPasswordResetCode(to: string, code: string) {
    await this.transporter.sendMail({
      from: `"HabitHub" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your HabitHub Password Reset Code',
      html: `
        <p>You requested a password reset.</p>
        <p>Here is your 6-digit reset code:</p>
        <h2>${code}</h2>
        <p>This code is valid for 15 minutes.</p>
      `,
    });
  }
}





