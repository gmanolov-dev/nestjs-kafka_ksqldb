export class SubscriptionFilter {
  pairs?: string[];
  exchanges?: string[];

  constructor(data: { pairs?: string[], exchanges?: string[] }) {
    this.pairs = data.pairs;
    this.exchanges = data.exchanges;
  }
}
