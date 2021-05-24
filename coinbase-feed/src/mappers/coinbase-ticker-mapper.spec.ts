import { Test, TestingModule } from '@nestjs/testing';
import { CoinbaseTickerMapper } from './coinbase-ticker-mapper';

describe('CoinbaseTickerMapper', () => {
  let provider: CoinbaseTickerMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoinbaseTickerMapper],
    }).compile();

    provider = module.get<CoinbaseTickerMapper>(CoinbaseTickerMapper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
