import { Deal } from "./deal.type";

export type DealType = 'crypto' | 'future' | 'option' | 'stock';
export type FeeType = 'flat' | 'percent';
export type DealStatus = 'open' | 'closed';

export type Interval = '1min' | '5min' | '15min' | '30min' | '60min';
export type OutputSize = 'compact' | 'full';

export interface Quote {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Ticker {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchScore: number;
}

export interface OptionValue {
  label: string;
  value: string;
}

export interface DealFilter {
  status: DealStatus | null;
}

export interface DealQuery {
  filter?: {
    filters: DealFilter[]
  }
}

export type FindDealResponse = {
  totalRows: number;
  results: Deal[];
};

export type LoginResponse = {
  id: string;
  email: string;
  accessToken: string
}
