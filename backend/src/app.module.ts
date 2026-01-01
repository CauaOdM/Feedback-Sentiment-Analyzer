import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { EmailModule } from './email/email.module';


@Module({
  imports: [
    // carregando variaveis do env
    ConfigModule.forRoot({ isGlobal: true }),

    //conecta com o banco de dados
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,

      
      // Carrega as tabelas automaticamente, conforme vou criando
      autoLoadEntities: true, 
      
      // mudar para false em produção
      synchronize: true, 
      logging: true,
    }),

    FeedbacksModule,

    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
