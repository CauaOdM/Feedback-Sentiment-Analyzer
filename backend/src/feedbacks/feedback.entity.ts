import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity() // identificador de tabela, basicamente da uma ordem de criação no banco de dados
export class Feedback {
  
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column() // coluna do nome do cliente
  customerName: string;

  @Column() // coluna do email do cliente
  email: string;

  @Column('simple-array', {nullable: true})
  categories: string[];


  @Column('text') //Coluna de feedbacks
  content: string;

  @Column({ nullable: true }) 
  sentiment: string; 

  @Column({ default: false }) 
  actionRequired: boolean;

  @Column('text', { nullable: true })
  suggestedResponse: string;

  @CreateDateColumn() //preenche automaticamente a data 
  createdAt: Date;
}