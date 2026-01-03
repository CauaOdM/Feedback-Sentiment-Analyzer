import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { EmailService } from 'src/email/email.service';

/**
 * Serviço para gerenciar feedbacks
 * Responsável por CRUD, análise de sentimento via Gemini AI e processamento em background
 */
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

  /**
   * Cria novo feedback e inicia análise assíncrona
   * Não bloqueia requisição - processamento em background
   * @param createFeedbackDto - Dados do feedback (nome, email, conteúdo, categorias)
   * @returns Feedback salvo com ID (sentiment será preenchido em segundos)
   */
  async create(createFeedbackDto: CreateFeedbackDto) {
    const feedback = this.feedbacksRepository.create(createFeedbackDto);
    const savedFeedback = await this.feedbacksRepository.save(feedback);

    
    this.processFeedbackInBackground(savedFeedback);

    
    return savedFeedback;
  }

  /**
   * Processa feedback em background: analisa sentimento e envia email
   * Não bloqueia a resposta ao client - executa assincronamente
   * @private
   * @param feedback - Feedback a processar
   */
  private async processFeedbackInBackground(feedback: Feedback) {
    try {
      console.log(`[Background] Iniciando IA para Feedback ID: ${feedback.id}...`);

      // 1. Faz requisição ao Gemini para análise de sentimento e geração de resposta
      const analysis = await this.analyzeFeedback(feedback.content);

      // 2. Persiste resultado da análise (sentiment, actionRequired, suggestedResponse)
      await this.feedbacksRepository.update(feedback.id, {
        sentiment: analysis.sentiment,
        actionRequired: analysis.sentiment === 'NEGATIVE',
        suggestedResponse: analysis.response,
      });

      // 3. Envia email de confirmação ao cliente com seu feedback
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

  

  /**
   * Lista todos os feedbacks em ordem decrescente de data
   * @returns Array de feedbacks
   */
  async findAll() {
    return await this.feedbacksRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Deleta feedback por ID
   * @param id - UUID do feedback
   * @returns Resultado da deleção
   */
  async remove(id: string) {
    return await this.feedbacksRepository.delete(id);
  }

  /**
   * Atualiza resposta sugerida de um feedback
   * @param id - UUID do feedback
   * @param newResponse - Nova resposta (max 2 frases)
   * @returns Resultado da atualização
   */
  async updateResponse(id: string, newResponse: string) {
    return await this.feedbacksRepository.update(id, {
      suggestedResponse: newResponse
    });
  }

  /**
   * Envia email manualmente com resposta sugerida para o cliente
   * @param id - UUID do feedback
   * @returns Confirmação de envio
   * @throws Error se feedback não existir ou não tiver email
   */
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
  
  /**
   * Analisa sentimento do feedback usando Gemini 2.5 Flash
   * @private
   * @param text - Conteúdo do feedback para análise
   * @returns Objeto com sentiment (POSITIVE|NEGATIVE|NEUTRAL) e response empática
   * @throws Error se a API do Gemini falhar
   */
  private async analyzeFeedback(text: string): Promise<{ sentiment: string, response: string }> {
    try {
      // Prompt customizado: pede análise de sentimento + geração de resposta empática
      const prompt = `
        Aja como um gerente atencioso que se importa muito com a experiencia do cliente.
        Analise o seguinte feedback: "${text}"
        
        Retorne APENAS um JSON (sem crase, sem markdown) neste formato exato:
        {
          "sentiment": "POSITIVE" ou "NEGATIVE" ou "NEUTRAL",
          "response": "Escreva uma resposta curta (max 2 frases), empática e profissional para esse cliente."
        }
      `;

      // 1. Invoca Gemini 2.5 Flash com temperatura 0.2 para consistência
      const result = await this.model.invoke([
        new HumanMessage(prompt)
      ]);
      
      // 2. Remove markdown e parsa JSON da resposta
      const cleanText = result.content.toString().replace(/```json|```/g, '').trim();
      return JSON.parse(cleanText);

    } catch (error) {
      console.error('Erro na IA:', error);
      
      throw error; 
    }
  }
}