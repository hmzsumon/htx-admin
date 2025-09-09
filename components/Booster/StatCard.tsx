import { Button, Card, Tooltip } from "flowbite-react";
import { Pencil } from "lucide-react";
import React from "react";

const StatCard = ({
  title,
  value,
  hint,
  icon,
  accent = "",
  footer,
  onEdit,
  editLabel,
}: {
  title: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  accent?: string;
  footer?: React.ReactNode;
  onEdit?: () => void;
  editLabel?: string;
}) => {
  return (
    <Card
      className={`relative overflow-hidden rounded-2xl ${
        accent ? "bg-gradient-to-br " + accent : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {hint ? <p className="mt-0.5 text-xs text-gray-500">{hint}</p> : null}
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          {icon}
          {onEdit && (
            <Tooltip content={editLabel ?? "Edit"}>
              <Button
                size="xs"
                color="light"
                pill
                onClick={onEdit}
                className="ml-1 !p-1"
              >
                <Pencil size={14} />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold tabular-nums">{value}</div>
      {footer ? (
        <div className="mt-3 text-xs text-gray-500">{footer}</div>
      ) : null}
    </Card>
  );
};

export default StatCard;
