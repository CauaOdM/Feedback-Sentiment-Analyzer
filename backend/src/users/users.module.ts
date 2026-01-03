import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from 'src/users/user.entity';

/**
 * Módulo de Usuários (Gestores)
 * 
 * Responsabilidades:
 * - Gerenciamento de usuários/proprietários de empresas
 * - CRUD de usuários
 * - Autenticação de credenciais
 * 
 * Exportação:
 * - UsersService é exportado para uso em AuthModule
 */
  exports: [UsersService],
})
export class UsersModule {}
