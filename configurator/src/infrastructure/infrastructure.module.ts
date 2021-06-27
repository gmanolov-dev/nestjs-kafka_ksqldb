import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainModule } from 'src/domain/domain.module';
import { MappersModule } from 'src/mappers/mappers.module';
import { FeedConfigurationChangeProducer } from './kafka/feed-configuration-changed-producer';
import { RegisterFeedConsumer } from './kafka/register-feed-consumer';
import { ExchangeEntity } from './datasource/entity/exchange.entity';
import { ExchangeFeedConfigService } from './datasource/exchange-feed-config.service';
import { UpdateConfigController } from './http/update-config.controller';
import { InfrastructureFacade } from './infrastructure.facade';

console.log({
  type: 'mongodb',
  host: process.env.CONFIGURATOR_MONGO_HOST,
  port: parseInt(process.env.CONFIGURATOR_MONGO_PORT),
  username: process.env.CONFIGURATOR_MONGO_USER,
  password: process.env.CONFIGURATOR_MONGO_PASS,
  database: 'configurator',
  entities: [ExchangeEntity],
  useUnifiedTopology: true,
});

@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        type: 'mongodb',
        host: process.env.CONFIGURATOR_MONGO_HOST,
        port: parseInt(process.env.CONFIGURATOR_MONGO_PORT),
        username: process.env.CONFIGURATOR_MONGO_USER,
        password: process.env.CONFIGURATOR_MONGO_PASS,
        database: 'configurator',
        entities: [ExchangeEntity],
        useUnifiedTopology: true,
      }
    ),
    TypeOrmModule.forFeature(
      [
        ExchangeEntity,
      ]
    ),
    MappersModule,
    forwardRef(() => DomainModule),
  ],
  controllers: [UpdateConfigController],
  providers: [InfrastructureFacade, RegisterFeedConsumer, ExchangeFeedConfigService, FeedConfigurationChangeProducer],
  exports: [InfrastructureFacade]
})
export class InfrastructureModule { }
