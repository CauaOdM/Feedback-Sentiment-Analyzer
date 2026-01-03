import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

/**
 * DTO para criação de usuário (gestor)
 * Valida dados de cadastro antes de processar
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail() // Valida se tem @ e ponto
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' }) // Segurança extra
  password: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  nicho: string;
}