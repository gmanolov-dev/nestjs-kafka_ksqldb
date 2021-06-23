export class ExchangeFeedConfigEntity {
  
  constructor(public exchange: string, public pairs: { [pair: string]: boolean }) {

  }
}