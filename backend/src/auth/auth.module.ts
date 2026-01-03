import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Módulo de Autenticação
 * 
 * Responsabilidades:
 * - Estratégias de autenticação (Local e JWT)
 * - Geração de tokens JWT (expira em 1 dia)
 * - Validação de credenciais
 * 
 * Estratégias:
 * - LocalStrategy: Valida email/senha no login
 * - JwtStrategy: Valida tokens em rotas protegidas
 */
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory  : async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET')!, 
      signOptions: { expiresIn: '1d' }, // O token vale por 1 dia
    }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService], // Exportamos caso precise usar em outro lugar
})
export class AuthModule {}