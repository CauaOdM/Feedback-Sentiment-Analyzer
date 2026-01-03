
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Feedback } from '../feedbacks/feedback.entity';

/**
 * Entidade User - Representa um gestor/proprietário
 * Suporta múltiplos feedbacks por usuário
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') // ID único e seguro (ex: a0eebc99-9c0b...)
  id: string;

  @Column()
  name: string; // Nome do Gestor (ex: "João Silva")

  @Column({ unique: true })
  email: string; // Login (não pode repetir)

  @Column()
  password: string; // Senha criptografada (hash)

  @Column()
  companyName: string; // Nome da Empresa (ex: "Pizzaria do João")

  @Column({ unique: true })
  slug: string; // URL da empresa (ex: "pizzaria-do-joao")

  @Column({ nullable: true })
  nicho: string; // Contexto p/ IA (ex: "Restaurante Italiano", "Clínica Dentária")

  @CreateDateColumn()
  createdAt: Date;

  // RELAÇÃO: Um Usuário (Dono) tem VÁRIOS Feedbacks
  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];
}