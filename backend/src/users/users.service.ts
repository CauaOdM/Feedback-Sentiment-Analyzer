import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * Serviço para gerenciar usuários/gestores
 * Responsável por CRUD com bcrypt para senhas
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Encontra usuário pelo email
   * Usado para login e validação
   * @param email - Email do usuário
   * @returns Usuário encontrado ou null
   */
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Encontra usuário pelo ID (UUID)
   * @param id - UUID do usuário
   * @returns Usuário encontrado ou null
   */
  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOneBySlug(slug: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { slug } });
  }

  async getProfileById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }

  async getPublicBySlug(slug: string): Promise<Pick<User, 'name' | 'companyName' | 'slug' | 'nicho'> | null> {
    const user = await this.usersRepository.findOne({ where: { slug } });
    if (!user) return null;
    const { name, companyName, slug: s, nicho } = user;
    return { name, companyName, slug: s, nicho };
  }

  /**
   * Cria novo usuário com senha criptografada
   * @param createUserDto - Dados do usuário (name, email, password, companyName, slug, nicho)
   * @returns Usuário criado com password hasheado
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. Gera salt (aleatório) para bcrypt
    const salt = await bcrypt.genSalt();
    
    // 2. Hash bcrypt com salt: transforma senha em string irreversível
    // Usa algoritmo blowfish com 10 rounds (configurado na bcrypt)
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // 3. Cria usuário com dados do DTO
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword, // Persiste hash, nunca a senha em texto plano
    });

    // 4. Salva no banco de dados
    return this.usersRepository.save(newUser);
  }
}
