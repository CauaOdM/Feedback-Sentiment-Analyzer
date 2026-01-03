import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Estratégia Local do Passport
 * 
 * Valida credenciais (email e senha) durante o login
 * Utilizada no endpoint POST /auth/login
 * 
 * Campo de login customizado: email (não username)
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // Avisamos que o login é via EMAIL, não username
  }

  /**
   * Valida credenciais de um usuário
   * @param email - Email do usuário
   * @param pass - Senha em texto plano
   * @returns Usuário validado ou lança UnauthorizedException
   * @throws UnauthorizedException - Se credenciais inválidas
   */
  async validate(email: string, pass: string): Promise<any> {
    const user = await this.authService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}