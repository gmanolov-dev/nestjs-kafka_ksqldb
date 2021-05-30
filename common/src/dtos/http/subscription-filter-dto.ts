export class SubscriptionFilterDto {
  readonly pairs?: string[];
  readonly exchanges?: string[];

  constructor(data: { pairs?: string[], exchanges?: string[] }) {
    this.pairs = data.pairs;
    this.exchanges = data.exchanges;
  }
}