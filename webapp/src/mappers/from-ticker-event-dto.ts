import { TickerEvent } from "../model";
import { MessageEventDto } from "common/dtos/http";

export const fromTickerEventDto = (messageEventDto: MessageEventDto): TickerEvent => {
  return new TickerEvent(JSON.parse(messageEventDto.data));
}