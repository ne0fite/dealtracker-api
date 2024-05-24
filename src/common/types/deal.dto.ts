import { DealStatus, DealType, FeeType } from ".";

export interface DealDto {
  openDate?: string | null;
  closeDate?: string | null;
  exchange?: string | null;
  ticker?: string | null;
  assetType?: DealType
  status?: DealStatus,

  units?: number | null;
  openPrice?: number | null;
  takeProfit?:  number | null;
  stopLoss?:  number | null;
  feeOpen?:  number | null;
  feeClose?:  number | null;
  feeType?: FeeType,
  closePrice?:  number | null;

  projectId?: string | null;
  notes?: string | null;
}
