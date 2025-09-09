import { formatCurrency } from "@/lib/format";
import { Card, Tooltip } from "flowbite-react";
import { Info } from "lucide-react";
import InfoRow from "./InfoRow";

const TotalsCard = ({
  totalAmount,
  totalProfit,
  totalBonus,
  totalFee,
}: {
  totalAmount: number;
  totalProfit: number;
  totalBonus: number;
  totalFee: number;
}) => {
  const net = totalProfit + totalBonus + totalFee;
  return (
    <Card className="rounded-2xl">
      <div className="mb-2">
        <h3 className="text-lg font-semibold">Totals</h3>
        <p className="text-sm text-gray-500">Lifetime performance snapshot</p>
      </div>
      <div className="space-y-2">
        <InfoRow
          label="Total Boost Amount"
          value={formatCurrency(totalAmount)}
        />
        <InfoRow label="Total Profit" value={formatCurrency(totalProfit)} />
        <InfoRow label="Total Bonus" value={formatCurrency(totalBonus)} />
        <div className="flex items-center justify-between py-1">
          <div className="inline-flex items-center gap-1 text-sm text-gray-500">
            <span>Total Fee</span>
            <Tooltip content="Includes negative values if fees were deducted">
              <Info size={14} className="text-gray-400" />
            </Tooltip>
          </div>
          <span
            className={`text-sm font-medium tabular-nums ${
              totalFee < 0 ? "text-red-600" : ""
            }`}
          >
            {formatCurrency(totalFee)}
          </span>
        </div>
        <div className="my-1 h-px bg-gray-100" />
        <div className="flex items-center justify-between py-1">
          <span className="text-sm font-semibold">Net Total</span>
          <span
            className={`text-sm font-semibold tabular-nums ${
              net >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {formatCurrency(net)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TotalsCard;
