import { Controller, Post, Body, Get, Delete, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('jwt'))
  @Get() 
  findAll(@Request() req) {
    return this.feedbacksService.findAllByUser(req.user.userId);
  }
  /**
   * DELETE /feedbacks/:id
   * Deleta feedback por ID
   */
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(id);
  }

  /**
   * PATCH /feedbacks/:id
   * Atualiza resposta sugerida de um feedback
   */
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/reply')
  sendReply(@Param('id') id: string) {
    return this.feedbacksService.sendManualEmail(id);
  }
}