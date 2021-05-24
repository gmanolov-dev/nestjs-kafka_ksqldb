import { TickerEvent } from "../model";
import { TickerEventDto } from "common/dtos/http/ticker-event-dto";

export const fromTickerEventDto = (tickerEventDto: TickerEventDto): TickerEvent => {
  return new TickerEvent({...tickerEventDto});
}