import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExchangeFeedEntity } from "src/domain/entities/exchange-feed.entity";
import { Repository } from "typeorm";
import { ObjectID } from 'mongodb';
import { ExchangeEntity } from "./entity/exchange.entity";
import { ExchangeFeedConfigEntity } from "src/domain/entities/exchange-feed-config.entity";

@Injectable()
export class ExchangeFeedConfigService {
  constructor(
    @InjectRepository(ExchangeEntity) 
    private exchangeEntityRepository: Repository<ExchangeEntity>
  ) {}

  async update(exchangeFeedConfigEntity: ExchangeFeedConfigEntity): Promise<ExchangeEntity> {
    let existing = await this.exchangeEntityRepository.findOne({exchange: exchangeFeedConfigEntity.exchange});
    
    if (!existing) {
      existing = new ExchangeEntity();
      existing.exchange = exchangeFeedConfigEntity.exchange;
      existing.pairs = exchangeFeedConfigEntity.pairs;
    } else {
      existing.pairs = exchangeFeedConfigEntity.pairs;
    }

    console.log(existing);

    return await this.exchangeEntityRepository.save(existing);
  }

  async updateExchangeEntity(exchangeFeedEntity: ExchangeFeedEntity): Promise<ExchangeEntity> {
    let existing = await this.exchangeEntityRepository.findOne({exchange: exchangeFeedEntity.exchange});
    
    if (!existing) {
      existing = new ExchangeEntity();
      existing.exchange = exchangeFeedEntity.exchange;
      existing.pairs = exchangeFeedEntity.pairs
        .reduce((acc, el) => ({ ...acc, [el]: false }), {});
    } else {
      existing.pairs = exchangeFeedEntity.pairs
        .reduce((acc, el) => ({ ...acc, [el]: existing.pairs[el] || false }), {});
    }

    return await this.exchangeEntityRepository.save(existing);
  }

  async updateMany(exchangeFeedConfigEntities: ExchangeFeedConfigEntity[]): Promise<ExchangeEntity[]> {
    const result: ExchangeEntity[] = [];
    for (let i=0; i < exchangeFeedConfigEntities.length; i++) {
      result.push(await this.update(exchangeFeedConfigEntities[i]))
    }
    
    return result;
  }
}