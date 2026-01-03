import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService 
  ) {}

  // ROTA 1: Login (Retorna o Token)
  @UseGuards(AuthGuard('local')) // Usa o LocalStrategy para verificar senha antes
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // ROTA 2: Cadastro (Cria o Usuário)
  // Deixamos pública para você criar seu primeiro gestor
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}