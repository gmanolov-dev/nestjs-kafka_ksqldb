export class SubscriptionFilterDto {
  constructor(public exchange: string, public pairs: string[]) {}
}
