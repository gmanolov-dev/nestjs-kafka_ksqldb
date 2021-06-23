export class FeedConfig {
  constructor(public exchange: string, public pairs: { [pair: string]: boolean }) { }
}