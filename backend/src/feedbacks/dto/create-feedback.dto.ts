import { IsNotEmpty, IsString,  IsEmail, Length } from 'class-validator';

export class CreateFeedbackDto {
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome do cliente é obrigatório' })
  customerName: string;

  @IsEmail({}, { message: 'Por favor, forneça um e-mail válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 500, { message: 'O feedback deve ter entre 10 e 500 caracteres' })
  content: string;
}