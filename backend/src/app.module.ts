import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // carregando variaveis do env
    ConfigModule.forRoot(),

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
