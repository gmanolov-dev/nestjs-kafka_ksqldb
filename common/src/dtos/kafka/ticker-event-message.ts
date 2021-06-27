import { TickerEventType } from "../../common/enums";

export class TickerEventMessage {
  readonly time: Date;
  readonly pair: string;
  readonly price: number;
  readonly type: TickerEventType;
  readonly size: number;
  readonly exchange: string;

  constructor(data: {time: Date, pair: string, price: number, type: TickerEventType, size: number, exchange: string} ) {
    this.time = data.time;
    this.pair = data.pair;
    this.price = data.price;
    this.type = data.type;
    this.size = data.size;
    this.exchange = data.exchange;
  }
}
