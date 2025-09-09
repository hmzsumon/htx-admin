import React from "react";

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
};

export default InfoRow;
