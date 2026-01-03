import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'; //criptografia da senha
import { CreateUserDto } from './dto/create-user.dto'; // DTO para criação de usuário

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 1. Encontrar usuário pelo email (Usado no Login)
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // 2. Encontrar usuário pelo ID (Usado para buscar feedbacks)
  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // 3. Criar novo usuário (Cadastro)
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Criptografa a senha antes de salvar
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword, // Salva o hash, não a senha real
    });

    return this.usersRepository.save(newUser);
  }
}
