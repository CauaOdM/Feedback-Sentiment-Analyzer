import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 1. Carrega as variáveis do arquivo .env para a memória
    ConfigModule.forRoot(),

    // 2. Configura a conexão com o Banco de Dados
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      
      // AutoLoad: Descobre automaticamente as tabelas (Entidades) que criaremos depois
      autoLoadEntities: true, 
      
      // Sync: Cria as tabelas automaticamente. 
      // PERIGO: Em produção (empresa real) isso deve ser FALSE, pois pode apagar dados.
      // Para nosso projeto MVP, deixamos TRUE para ganhar velocidade.
      synchronize: true, 
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
