import { Controller, Post, Body, Get } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Delete, Param } from '@nestjs/common/decorators';

@Controller('feedbacks') // Define a rota base: http://localhost:3000/feedbacks
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post() // Quando alguém mandar um POST...
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    // ...pegue o corpo da requisição (@Body) e mande pro arquivo (Service)
    return this.feedbacksService.create(createFeedbackDto);
  }

  @Get() // Quando alguém mandar um GET...
  findAll() {
    // ...pegue tudo que tem no banco
    return this.feedbacksService.findAll();
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(id);
  }
}