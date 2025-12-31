import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity() // identificador de tabela, basicamente da uma ordem de criação no banco de dados
export class Feedback {
  
  @PrimaryGeneratedColumn('uuid') // 2. ID user (não sei se é seguro)
  id: string;

  @Column() // coluna do nome do cliente
  customerName: string;

  @Column() // coluna do email do cliente
  email: string;

  @Column('text') //Coluna de feedbacks
  content: string;

  @Column({ nullable: true }) //Pode ser nulo (a IA vai preencher depois)
  sentiment: string; 

  @Column({ default: false }) //Valor padrão é falso
  actionRequired: boolean;

  @Column('text', { nullable: true })
  suggestedResponse: string;

  @CreateDateColumn() //preenche automaticamente a data 
  createdAt: Date;
}