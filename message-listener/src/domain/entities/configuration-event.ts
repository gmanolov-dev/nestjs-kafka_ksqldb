import { TickerEventType } from "common/common/enums";

export class ConfigurationEvent {
  constructor(public exchange: string, public pairs: {[pair: string] : boolean}) {}
}
