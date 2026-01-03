import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

/**
 * Serviço de autenticação
 * Gerencia validação de credenciais e geração de JWT
 */
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    /**
     * Valida credenciais do usuário (email + senha)
     * Compara senha informada com hash bcrypt do banco
     * @param email - Email do usuário
     * @param pass - Senha em texto plano
     * @returns Usuário sem password se válido, null caso contrário
     */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    // Comparação segura: bcrypt.compare descodifica o hash e valida
    // Protege contra timing attacks (tempo constante)
    if (user && await bcrypt.compare(pass, user.password)) {
      // Remove a senha do objeto antes de retornar (segurança)
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Gera JWT após validação de credenciais
   * Token válido por 1 dia
   * @param user - Usuário autenticado
   * @returns Token JWT no formato { access_token: string }
   */
  async login(user: any) {
    // Payload contém informações do usuário para serem codificadas no token
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload), // JWT é gerado com secret da config
    };
  }
}
