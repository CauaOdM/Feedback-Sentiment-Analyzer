import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

/**
 * Controlador de autenticação
 * Endpoints para login e registro
 */
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService 
  ) {}

  /**
   * POST /auth/login
   * Faz login com email e senha, retorna JWT
   * Guard 'local' valida credenciais antes
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  /**
   * POST /auth/register
   * Cria novo usuário (gestor)
   * Rota pública para criar primeiro gestor
   */
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}