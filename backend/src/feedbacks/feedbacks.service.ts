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
    const feedback = this.feedbacksRepository.create(createFeedbackDto);
    const savedFeedback = await this.feedbacksRepository.save(feedback);

    
    this.processFeedbackInBackground(savedFeedback);

    
    return savedFeedback;
  }

  
  private async processFeedbackInBackground(feedback: Feedback) {
    try {
      console.log(`[Background] Iniciando IA para Feedback ID: ${feedback.id}...`);

      
      const analysis = await this.analyzeFeedback(feedback.content);

      
      await this.feedbacksRepository.update(feedback.id, {
        sentiment: analysis.sentiment,
        actionRequired: analysis.sentiment === 'NEGATIVE',
        suggestedResponse: analysis.response,
      });

      
      if (feedback.email) {
        await this.emailService.sendEmail(
          feedback.email,
          'Recebemos seu Feedback!',
          `Olá ${feedback.customerName},\n\nRecebemos seu comentário: "${feedback.content}"\n\nNossa equipe está analisando e em breve entraremos em contato!\n\nAtenciosamente,\n Equipe de atendimento ao cliente`
        );
      }

      console.log(`[Background] Finalizado com sucesso para ID: ${feedback.id}`);

    } catch (error) {
      console.error(`[Background] Erro no ID ${feedback.id}:`, error);
      
      
      await this.feedbacksRepository.update(feedback.id, {
        sentiment: 'ERRO', 
        actionRequired: true,
        suggestedResponse: 'Erro ao processar IA. Verifique manualmente.'
      });
    }
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
      'Resposta ao seu Feedback - Atendimento ao Cliente',
      `Olá ${feedback.customerName},\n\nReferente ao seu comentário: "${feedback.content}"\n\n${feedback.suggestedResponse}\n\nAtenciosamente,\nEquipe de Atendimento ao Cliente`
    );

    return { message: 'Email enviado com sucesso!' };
  }
  
  private async analyzeFeedback(text: string): Promise<{ sentiment: string, response: string }> {
    try {
      const prompt = `
        Aja como um gerente atencioso que se importa muito com a experiencia do cliente.
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
      return JSON.parse(cleanText);

    } catch (error) {
      console.error('Erro na IA:', error);
      
      throw error; 
    }
  }
}