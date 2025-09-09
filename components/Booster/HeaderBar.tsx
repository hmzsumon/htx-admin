// ────────────────────────────────────────────────────────────────────────────────

import { Badge, Button } from "flowbite-react";
import { BadgeCheck, RefreshCcw } from "lucide-react";

// <HeaderBar />
function HeaderBar({
  active,
  onRefresh,
}: {
  active: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Booster Profit Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your booster performance and totals
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge color={active ? "success" : "gray"} className="px-3 py-1">
          <span className="inline-flex items-center gap-1">
            <BadgeCheck size={16} /> {active ? "Active" : "Inactive"}
          </span>
        </Badge>
        <Button color="light" onClick={onRefresh} className="rounded-full">
          <span className="inline-flex items-center gap-2">
            <RefreshCcw size={16} /> Refresh
          </span>
        </Button>
      </div>
    </div>
  );
}

export default HeaderBar;
