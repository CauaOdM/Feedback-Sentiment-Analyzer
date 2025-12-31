import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity() // 1. identificador de tabela, basicamente da uma ordem de criação no banco de dados
export class Feedback {
  
  @PrimaryGeneratedColumn('uuid') // 2. ID user (não sei se é seguro)
  id: string;

  @Column() // 3. coluna do nome do cliente
  customerName: string;

  @Column('text') // 4. Coluna de feedbacks
  content: string;

  @Column({ nullable: true }) // 5. Pode ser nulo (a IA vai preencher depois)
  sentiment: string; 

  @Column({ default: false }) // 6. Valor padrão é falso
  actionRequired: boolean;

  @Column('text', { nullable: true })
  suggestedResponse: string;

  @CreateDateColumn() // 7. preenche automaticamente a data 
  createdAt: Date;
}