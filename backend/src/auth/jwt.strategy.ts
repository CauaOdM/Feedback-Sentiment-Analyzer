import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Estratégia JWT do Passport
 * 
 * Valida tokens JWT em rotas protegidas
 * Token é extraído do header Authorization (Bearer Token)
 * Lança erro se token expirado
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!, 
    });
  }

  /**
   * Valida payload do token JWT
   * @param payload - Conteúdo decodificado do token
   * @returns Objeto com informações do usuário (userId, email)
   */
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}