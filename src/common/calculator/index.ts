import { fromPercent, fromRatio } from '../conversions';
import { Deal } from '../types/deal.type';

export function calculateDeal(deal: Deal): void {
    deal.invest = fromRatio(deal.openPrice, deal.units);
    deal.takeProfitAmount = fromPercent(deal.takeProfit, deal.invest);
    deal.stopLossAmount = fromPercent(deal.stopLoss, deal.invest);

    deal.takeProfitGross = null;
    deal.takeProfitFeeAmount = null;
    deal.takeProfitCostBasis = null;
    deal.takeProfitPrice = null;

    deal.stopLossGross = null;
    deal.stopLossFeeAmount = null;
    deal.stopLossCostBasis = null;
    deal.stopLossPrice = null;

    deal.closeFeeAmount = null;
    deal.closeCostBasis = null;
    deal.closeGross = null;

    deal.profitLoss = null;
    deal.profitLossPercent = null;
    deal.progress = null;

    if (deal.invest == null || deal.units == null) {
        return;
    }

    if (deal.feeOpen != null && deal.feeClose != null) {
        if (deal.feeType === 'percent') {
            const feeOpenPercent = deal.feeOpen / 100;
            const feeClosePercent = deal.feeClose / 100;

            deal.openFeeAmount = deal.invest * feeOpenPercent;

            if (deal.takeProfitAmount != null && deal.takeProfitAmount > 0) {
                deal.takeProfitGross = (deal.invest * (1 + feeOpenPercent) + deal.takeProfitAmount) / (1 - feeClosePercent);
                deal.takeProfitFeeAmount = deal.takeProfitGross - deal.invest - deal.takeProfitAmount - deal.openFeeAmount;
                deal.takeProfitCostBasis = deal.invest + deal.openFeeAmount + deal.takeProfitFeeAmount;
                deal.takeProfitPrice = deal.takeProfitGross / deal.units;
            }

            if (deal.stopLossAmount != null && deal.stopLossAmount > 0) {
                deal.stopLossGross = (deal.invest * (1 + feeOpenPercent) - deal.stopLossAmount) / (1 - feeClosePercent);
                deal.stopLossFeeAmount = (deal.invest - deal.stopLossAmount + deal.openFeeAmount) * feeClosePercent;
                deal.stopLossCostBasis = deal.invest + deal.openFeeAmount + deal.stopLossFeeAmount;
                deal.stopLossPrice = deal.stopLossGross / deal.units;
            }

            if (deal.closePrice != null && deal.closePrice > 0) {
                deal.closeFeeAmount = (deal.units * deal.closePrice) * feeClosePercent;
                deal.closeCostBasis = deal.invest + deal.openFeeAmount + deal.closeFeeAmount;
            }
        } else {
            deal.openFeeAmount = deal.feeOpen;

            if (deal.takeProfitAmount != null && deal.takeProfitAmount > 0) {
                deal.takeProfitFeeAmount = deal.feeClose;
                deal.takeProfitCostBasis = deal.invest + deal.feeOpen + deal.feeClose;
                deal.takeProfitGross = deal.takeProfitCostBasis + deal.takeProfitAmount;
                deal.takeProfitPrice = deal.takeProfitGross / deal.units;
            }

            if (deal.stopLossAmount != null && deal.stopLossAmount > 0) {
                deal.stopLossFeeAmount = deal.feeClose;
                deal.stopLossCostBasis = deal.invest + deal.feeOpen + deal.feeClose;
                deal.stopLossGross = deal.stopLossCostBasis - deal.stopLossAmount;
                deal.stopLossPrice = deal.stopLossGross / deal.units;
            }

            if (deal.closePrice != null && deal.closePrice > 0) {
                deal.closeFeeAmount = deal.feeClose;
                deal.closeCostBasis = deal.invest + deal.feeOpen + deal.feeClose;
            }
        }
    }

    if (deal.closePrice != null && deal.closePrice > 0) {
        deal.closeGross = deal.closePrice * deal.units;

        if (deal.closeCostBasis != null) {
            deal.profitLoss = (deal.units * deal.closePrice) - deal.closeCostBasis;
            deal.profitLossPercent = deal.profitLoss / deal.invest * 100;

            if (deal.takeProfitAmount != null && deal.takeProfitAmount > 0) {
                // this is how close we are to (or far away from) our profit
                deal.progress = deal.profitLoss / deal.takeProfitAmount * 100;
            }
        }
    }
}
