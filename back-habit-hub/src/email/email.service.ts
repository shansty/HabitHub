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
    console.dir('start email verif')
    console.log(process.env.EMAIL_USER)
    const verifyUrl = `http://localhost:5173/verify-email?code=${code}`;
    console.dir({verifyUrl})
    await this.transporter.sendMail({
      from: `"HabitHub" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Confirm your email',
      html: `<p>Click to confirm your email:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
    });
    console.dir('end verif')
  }
}


