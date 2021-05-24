import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TickerEventSender } from 'src/infrastructure/amqp/ticker-event-sender';
import { CryptoRepository } from 'src/infrastructure/repositories/crypto-repository';

@Injectable()
export class CoinbaseCryptoTicker implements OnModuleInit {
  constructor(
    private readonly cryptoRepository: CryptoRepository,
  ) { }

  onModuleInit() {
    this.cryptoRepository.getFeed().subscribe(data => {
      this.cryptoRepository.saveEvent(data);
    });
  }
}
