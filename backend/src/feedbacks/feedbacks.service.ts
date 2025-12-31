import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';

@Injectable()
export class FeedbacksService {

  private model: ChatGoogleGenerativeAI;

  constructor(
    // Injeção de Dependência:
    // Estamos pedindo pro NestJS: "Me dá a ferramenta de mexer na tabela Feedback"
    @InjectRepository(Feedback)
    private feedbacksRepository: Repository<Feedback>,
  ) {
    this.model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0,
    });
  }

  async create(createFeedbackDto: CreateFeedbackDto) {

    const sentiment = await this.analyzeSentiment(createFeedbackDto.content);
    //Cria o objeto na memória (ainda não salvou)
    const newFeedback = this.feedbacksRepository.create({
      ... createFeedbackDto,
      sentiment: sentiment,
      actionRequired: sentiment === 'NEGATIVE'
    });
    
    //Salva no banco de dados (o INSERT INTO acontece aqui)
    return await this.feedbacksRepository.save(newFeedback);
  }

  async findAll() {
    // Busca todos os feedbacks (SELECT * FROM feedback)
    return await this.feedbacksRepository.find({
      order: { createdAt: 'DESC' } // Mostra os mais recentes primeiro
    });
  }
  private async analyzeSentiment(text: string): Promise<string> {
      try {
        const prompt = `
          Analise o sentimento do seguinte feedback.
          Responda APENAS com uma destas palavras: POSITIVE, NEGATIVE, NEUTRAL.
          Feedback: "${text}"
        `;
        const response = await this.model.invoke([
          new HumanMessage(prompt)
        ]);
        const finalSentiment = response.content.toString().trim().toUpperCase(); // Tirando espaços e deixando tudo maiusculo para tratamento de strings
        //Só retorna se for um valor esperado
        if (['POSITIVE', 'NEGATIVE', 'NEUTRAL'].includes(finalSentiment)) {
          return finalSentiment;
        }
        return 'NEUTRAL'; //Se der ruim, retorna neutro
      } catch (error) {
        console.error('Erro na IA:', error);
        return 'NEUTRAL';
      }
  }
}