import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
const configModule = ConfigModule.forRoot({
  envFilePath: process.env.NODE_ENV ?  [ `../.env/.env.${process.env.NODE_ENV}` ] : [ `../.env/.env.development` ],
  isGlobal: true,
});

import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { MappersModule } from './mappers/mappers.module';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [
    configModule,
    InfrastructureModule,
    MappersModule,
    DomainModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
