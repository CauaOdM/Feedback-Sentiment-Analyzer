import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

/**
 * Serviço de email
 * Integrado com Gmail via nodemailer
 * Usa App Password (não senha real) para segurança
 */
@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    console.log('Tentando logar no Gmail com:', process.env.EMAIL_USER);
    console.log('A senha existe?', process.env.EMAIL_PASS ? 'SIM' : 'NÃO');
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * Envia email para um destinatário
   * @param to - Email do destinatário
   * @param subject - Assunto do email
   * @param text - Corpo do email em texto simples
   */
  async sendEmail(to: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Atendimento ao Cliente " <${process.env.EMAIL_USER}>`,
        to: to, 
        subject: subject, 
        text: text
      });
      console.log('E-mail enviado: %s', info.messageId);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
    }
  }
}