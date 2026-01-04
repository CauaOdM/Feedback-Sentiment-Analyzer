import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

/**
 * Módulo de Envio de Emails
 * 
 * Responsabilidades:
 * - Integração com Gmail via Nodemailer
 * - Envio de respostas a clientes
 * 
 * Configuração:
 * - Usa App Password (não senha do usuário)
 * - SMTP: smtp.gmail.com
 */
@Module({
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
