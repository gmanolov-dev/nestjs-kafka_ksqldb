export class FeedConfigDto {
  constructor(public exchange: string, public pairs: { [pair: string]: boolean }) { }
}