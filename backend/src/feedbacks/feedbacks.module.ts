import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { Feedback } from './feedback.entity'; 
import { EmailModule } from 'src/email/email.module';

/**
 * Módulo de Feedbacks
 * 
 * Responsabilidades:
 * - Gerenciamento de feedbacks de clientes
 * - Análise de sentimento via Gemini AI
 * - Envio de respostas por email
 * 
 * Dependências:
 * - TypeORM (persistência Feedback)
 * - EmailModule (envio de emails)
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback]),
    EmailModule 
  ],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}