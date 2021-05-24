import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
const configModule = ConfigModule.forRoot({
  envFilePath: process.env.NODE_ENV ?  [ `../.env/.env.${process.env.NODE_ENV}` ] : [ `../.env/.production.env` ],
  isGlobal: true,
});

import { DomainModule } from './domain/domain.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { MappersModule } from './mappers/mappers.module';



@Module({
  imports: [
    configModule,
    DomainModule,
    InfrastructureModule,
    MappersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  
}
