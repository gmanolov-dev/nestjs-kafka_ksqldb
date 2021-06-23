export class FeedConfigMessage {
  constructor(public exchange: string, public pairs: { [pair: string]: boolean }) { }
}