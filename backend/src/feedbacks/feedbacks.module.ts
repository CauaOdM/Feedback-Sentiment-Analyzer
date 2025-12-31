import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar TypeORM
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { Feedback } from './feedback.entity'; // Importar sua Entidade
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    // Aqui dizemos: "Este módulo é responsável pela tabela Feedback"
    TypeOrmModule.forFeature([Feedback]),
    EmailModule 
  ],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}