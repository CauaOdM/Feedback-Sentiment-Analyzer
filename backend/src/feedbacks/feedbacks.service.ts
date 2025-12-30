import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(
    // Injeção de Dependência:
    // Estamos pedindo pro NestJS: "Me dá a ferramenta de mexer na tabela Feedback"
    @InjectRepository(Feedback)
    private feedbacksRepository: Repository<Feedback>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    // 1. Cria o objeto na memória (ainda não salvou)
    const newFeedback = this.feedbacksRepository.create(createFeedbackDto);
    
    // 2. Salva no banco de dados (o INSERT INTO acontece aqui)
    return await this.feedbacksRepository.save(newFeedback);
  }

  async findAll() {
    // Busca todos os feedbacks (SELECT * FROM feedback)
    return await this.feedbacksRepository.find({
      order: { createdAt: 'DESC' } // Mostra os mais recentes primeiro
    });
  }
}