import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    // 1. Valida se o usuário existe e a senha bate
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    // Se achou usuário E a senha bate (comparando hash)
    if (user && await bcrypt.compare(pass, user.password)) {
      // Remove a senha do objeto antes de retornar (segurança)
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 2. Gera o Token (Login efetivo)
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload), // Aqui nasce o token!
    };
  }


}
