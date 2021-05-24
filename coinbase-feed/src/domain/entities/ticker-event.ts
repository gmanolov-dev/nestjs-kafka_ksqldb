import { TickerEventType } from "common/common/enums";

export class TickerEvent {
  time: Date;
  pair: string;
  price: number;
  type: TickerEventType;
  size: number;
  readonly exchange: string = "Coinbase Pro";

  constructor(data: {time: Date, pair: string, price: number, type: TickerEventType, size: number} ) {
    this.time = data.time;
    this.pair = data.pair;
    this.price = data.price;
    this.type = data.type;
    this.size = data.size;
  }
}