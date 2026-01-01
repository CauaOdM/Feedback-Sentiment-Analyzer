import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class FeedbacksService {
  private model: ChatGoogleGenerativeAI;

  constructor(
    @InjectRepository(Feedback)
    private feedbacksRepository: Repository<Feedback>,
    private emailService: EmailService,
  ) {
    this.model = new ChatGoogleGenerativeAI({

      model: 'gemini-2.5-flash', 
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.2,
    });
  }

  async create(createFeedbackDto: CreateFeedbackDto) {
    const analysis = await this.analyzeFeedback(createFeedbackDto.content);

    const newFeedback = this.feedbacksRepository.create({
      ...createFeedbackDto,
      sentiment: analysis.sentiment,
      actionRequired: analysis.sentiment === 'NEGATIVE',
      suggestedResponse: analysis.response 
    });

    const savedFeedback = await this.feedbacksRepository.save(newFeedback);
    await this.emailService.sendEmail(
      createFeedbackDto.email,
      'Recebemos seu Feedback!',
      `Olá ${createFeedbackDto.customerName},\n\nRecebemos seu comentário: "${createFeedbackDto.content}"\n\nJá analisamos seu feedback e em breve um humano entrará em contato!\n\nAtenciosamente,\nEquipe de Sucesso do Cliente`
    );

    return savedFeedback;
  }

  async findAll() {
    return await this.feedbacksRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async remove(id: string) {
    return await this.feedbacksRepository.delete(id);
  }

  async updateResponse(id: string, newResponse: string) {
    return await this.feedbacksRepository.update(id, {
      suggestedResponse: newResponse
    });
  }
  async sendManualEmail(id: string) {
    const feedback = await this.feedbacksRepository.findOne({ where: { id } });

    if (!feedback) throw new Error('Feedback não encontrado!');
    if (!feedback.email) throw new Error('Este feedback não tem e-mail salvo!');

    await this.emailService.sendEmail(
      feedback.email,
      'Resposta ao seu Feedback - Feedback AI',
      `Olá ${feedback.customerName},\n\nReferente ao seu comentário: "${feedback.content}"\n\n${feedback.suggestedResponse}\n\nAtenciosamente,\nEquipe de Sucesso do Cliente`
    );

    return { message: 'Email enviado com sucesso!' };
  }

  
  private async analyzeFeedback(text: string): Promise<{ sentiment: string, response: string }> {
    try {
      const prompt = `
        Aja como um gerente de sucesso do cliente.
        Analise o seguinte feedback: "${text}"
        
        Retorne APENAS um JSON (sem crase, sem markdown) neste formato exato:
        {
          "sentiment": "POSITIVE" ou "NEGATIVE" ou "NEUTRAL",
          "response": "Escreva uma resposta curta (max 2 frases), empática e profissional para esse cliente."
        }
      `;

      const result = await this.model.invoke([
        new HumanMessage(prompt)
      ]);

      
      
      const cleanText = result.content.toString().replace(/```json|```/g, '').trim();
      
      // Transforma o texto em Objeto JavaScript real
      return JSON.parse(cleanText);

    } catch (error) {
      console.error('Erro:', error);
      return { sentiment: 'NEUTRAL', response: 'Obrigado pelo feedback.' };
    }
  }
}