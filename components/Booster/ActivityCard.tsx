import { formatDateTime, formatPercent } from "@/lib/format";
import { BoosterConfig } from "@/types/types";
import { Card } from "flowbite-react";
import { Calendar } from "lucide-react";
import InfoRow from "./InfoRow";

const ActivityCard = ({ b }: { b: BoosterConfig }) => {
  return (
    <Card className="rounded-2xl">
      <div className="mb-2 inline-flex items-center gap-2">
        <Calendar size={18} className="text-gray-500" />
        <div>
          <h3 className="text-lg font-semibold">Activity & Timeline</h3>
          <p className="text-sm text-gray-500">Key timestamps (Asia/Dhaka)</p>
        </div>
      </div>
      <div className="space-y-2">
        <InfoRow label="Created At" value={formatDateTime(b.createdAt)} />
        <InfoRow label="Last Updated" value={formatDateTime(b.updatedAt)} />
        <InfoRow label="Active" value={b.is_active ? "Yes" : "No"} />
        <div className="my-1 h-px bg-gray-100" />
        <InfoRow
          label="Boost % (current / previous)"
          value={`${formatPercent(b.boost_percentage)} / ${formatPercent(
            b.previous_boost_percentage
          )}`}
        />
        <InfoRow label="Bonus %" value={formatPercent(b.booster_bonus)} />
      </div>
    </Card>
  );
};

export default ActivityCard;
