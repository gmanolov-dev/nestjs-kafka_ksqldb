import { TickerEventType } from "common/common/enums";

export class TickerEvent {
  time: Date;
  pair: string;
  price: number;
  type: TickerEventType;
  size: number;
  exchange: string;

  constructor(data: {time: Date, pair: string, price: number, type: TickerEventType, size: number, exchange: string} ) {
    this.time = data.time;
    this.pair = data.pair;
    this.price = data.price;
    this.type = data.type;
    this.size = data.size;
    this.exchange = data.exchange;
  }
}