import { Controller, Post, Body, Get, Delete, Param, Patch } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

/**
 * Controlador de feedbacks
 * Endpoints para CRUD de feedbacks e respostas por email
 */
@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  /**
   * POST /feedbacks
   * Cria novo feedback (salva imediatamente, análise em background)
   */
  @Post() 
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbacksService.create(createFeedbackDto);
  }

  /**
   * GET /feedbacks
   * Lista todos os feedbacks em ordem decrescente de data
   */
  @Get() 
  findAll() {
    return this.feedbacksService.findAll();
  }
  /**
   * DELETE /feedbacks/:id
   * Deleta feedback por ID
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(id);
  }

  /**
   * PATCH /feedbacks/:id
   * Atualiza resposta sugerida de um feedback
   */
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() body: { suggestedResponse: string } 
  ) {
    return this.feedbacksService.updateResponse(id, body.suggestedResponse);
  }

  /**
   * POST /feedbacks/:id/reply
   * Envia email com resposta sugerida para o cliente
   */
  @Post(':id/reply')
  sendReply(@Param('id') id: string) {
    return this.feedbacksService.sendManualEmail(id);
  }
}