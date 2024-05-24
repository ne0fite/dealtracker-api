export interface Ticker {
  trade_id: number;
  ask: number;
  bid: number;
  volume: number;
  price: number;
  size: number;
  time: Date;
}

export interface Product {
  base_currency: string;
  quote_currency: string;
  quote_increment: number;
  base_increment: number;
  display_name: string;
  min_market_funds: number;
  margin_enabled: boolean;
  post_only: boolean;
  limit_only: boolean;
  cancel_only: boolean;
  status: string;
  status_message: string;
  auction_mode: boolean;
}
