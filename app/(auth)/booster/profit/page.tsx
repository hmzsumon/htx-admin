"use client";

import { fetchBaseQueryError } from "@/redux/services/helpers";
import PulseLoader from "react-spinners/PulseLoader";
import { toast } from "react-toastify";

import ActivityCard from "@/components/Booster/ActivityCard";
import ErrorView from "@/components/Booster/ErrorView";
import HeaderBar from "@/components/Booster/HeaderBar";
import LoadingState from "@/components/Booster/LoadingState";
import StatCard from "@/components/Booster/StatCard";
import TotalsCard from "@/components/Booster/TotalsCard";
import { formatCurrency, formatPercent } from "@/lib/format";

import {
  useDistributeBoosterProfitMutation,
  useGetBoosterConfigQuery,
  useUpdateBoosterConfigMutation,
} from "@/redux/features/booster/boosterApi";
import { BoosterConfig } from "@/types/types";

import { Badge, Button, Card, Modal, TextInput } from "flowbite-react";
import {
  BadgeCheck,
  Coins,
  Info,
  Percent,
  RefreshCcw,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// ────────────────────────────────────────────────────────────────────────────────
export default function BoosterPage() {
  const { data, isLoading, isError, refetch } = useGetBoosterConfigQuery();
  const [updateBooster, { isLoading: isSaving }] =
    useUpdateBoosterConfigMutation();

  const initialConfig: BoosterConfig | undefined =
    (data as any)?.boosterConfig ?? (data as any) ?? undefined;

  // Local editable copy so changes reflect immediately (optimistic UI)
  const [localConfig, setLocalConfig] = useState<BoosterConfig | undefined>(
    initialConfig
  );
  useEffect(() => setLocalConfig(initialConfig), [initialConfig]);

  // inside component:
  const [distributeProfit, { isLoading: isDistributing }] =
    useDistributeBoosterProfitMutation();

  const handleDistribute = async () => {
    try {
      // চাইলে নির্দিষ্ট দিনের জন্য: distributeProfit({ date: "2025-09-09" })
      const res = await distributeProfit().unwrap();
      const meta = res?.dateKey
        ? ` (${res.dateKey}, created: ${res.created ?? 0}, skipped: ${
            res.skipped ?? 0
          })`
        : "";
      toast.success((res?.message || "Profit distribution completed") + meta);
      refetch(); // ডেটা রিফ্রেশ
    } catch (err) {
      const msg =
        (err as fetchBaseQueryError)?.data?.message || "Distribution failed";
      toast.error(msg);
    }
  };

  // Editor modal state
  const [editor, setEditor] = useState<{
    field: "boost_percentage" | "booster_bonus" | null;
    value: string; // user input in % or decimal
    error?: string;
  }>({ field: null, value: "" });

  const openEditor = (
    field: "boost_percentage" | "booster_bonus",
    currentDecimal: number
  ) => {
    const prefill = (currentDecimal * 100).toString(); // show as % number
    setEditor({ field, value: prefill });
  };

  const closeEditor = () => setEditor({ field: null, value: "" });

  const saveEditor = async () => {
    if (!localConfig || !editor.field) return;

    const raw = Number(editor.value);
    if (Number.isNaN(raw)) {
      setEditor((s) => ({ ...s, error: "Please enter a number" }));
      return;
    }

    // Accept either 0-1 (decimal) or 0-100 (percent). Convert to decimal.
    let decimal = raw;
    if (raw > 1) decimal = raw / 100;

    if (decimal < 0 || decimal > 1) {
      setEditor((s) => ({
        ...s,
        error: "Value must be between 0 and 100 (or 0.0–1.0)",
      }));
      return;
    }

    const prev = localConfig;
    const next = { ...localConfig, [editor.field]: decimal } as BoosterConfig;
    setLocalConfig(next); // optimistic

    try {
      // Server expects partial body, e.g. { boost_percentage: 0.01 }
      const payload =
        editor.field === "boost_percentage"
          ? { boost_percentage: decimal }
          : { booster_bonus: decimal };

      await updateBooster(payload).unwrap();
      toast.success("Booster config updated successfully");
      closeEditor();
      // optional: refetch(); // invalidatesTags already does this
    } catch (err) {
      // revert on error
      setLocalConfig(prev);
      const msg =
        (err as fetchBaseQueryError)?.data?.message || "Failed to update";
      toast.error(msg);
    }
  };

  const b = localConfig;

  const computed = useMemo(() => {
    const boostPct = Number(b?.boost_percentage ?? 0);
    const prevBoostPct = Number(b?.previous_boost_percentage ?? 0);
    const diffPct = (boostPct - prevBoostPct) * 100;
    const bonusPct = Number(b?.booster_bonus ?? 0);
    const currentAmount = Number(b?.current_boost_amount ?? 0);
    const currentProfit = Number(b?.current_boost_profit ?? 0);
    const currentBonus = Number(b?.current_booster_bonus ?? 0);
    const totalAmount = Number(b?.total_boost_amount ?? 0);
    const totalProfit = Number(b?.total_boost_profit ?? 0);
    const totalBonus = Number(b?.total_booster_bonus ?? 0);
    const totalFee = Number(b?.total_booster_fee ?? 0);
    return {
      boostPct,
      prevBoostPct,
      diffPct,
      bonusPct,
      currentAmount,
      currentProfit,
      currentBonus,
      totalAmount,
      totalProfit,
      totalBonus,
      totalFee,
    };
  }, [b]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorView onRetry={() => refetch()} />;
  if (!b) {
    return (
      <div className="mx-auto max-w-3xl p-6 md:p-10">
        <Card>
          <h3 className="text-lg font-semibold">No booster data</h3>
          <p className="text-sm text-gray-600">
            There is no booster configuration to display.
          </p>
          <div className="mt-4">
            <Button color="light" onClick={() => refetch()}>
              <span className="inline-flex items-center gap-2">
                <RefreshCcw size={16} /> Refresh
              </span>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      {/* Header */}
      <HeaderBar active={!!b.is_active} onRefresh={() => refetch()} />

      {/* Top stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current Boost %"
          hint={`Prev: ${formatPercent(computed.prevBoostPct)}`}
          value={
            <div className="flex items-center gap-2">
              <span>{formatPercent(computed.boostPct)}</span>
              {computed.diffPct >= 0 ? (
                <Badge color="success" className="px-2 py-0.5">
                  <span className="inline-flex items-center gap-1">
                    <TrendingUp size={14} /> {computed.diffPct.toFixed(2)}
                  </span>
                </Badge>
              ) : (
                <Badge color="failure" className="px-2 py-0.5">
                  <span className="inline-flex items-center gap-1">
                    <TrendingDown size={14} />{" "}
                    {Math.abs(computed.diffPct).toFixed(2)}
                  </span>
                </Badge>
              )}
            </div>
          }
          icon={<Percent size={20} />}
          accent="from-emerald-500/5 to-transparent"
          onEdit={() => openEditor("boost_percentage", computed.boostPct)}
          editLabel="Edit current boost %"
        />

        <StatCard
          title="Booster Bonus %"
          hint="Rate applied to your bonus"
          value={formatPercent(computed.bonusPct)}
          icon={<Info size={20} />}
          accent="from-blue-500/5 to-transparent"
          onEdit={() => openEditor("booster_bonus", computed.bonusPct)}
          editLabel="Edit bonus %"
        />

        <StatCard
          title="Current Boost Amount"
          hint="Now active"
          value={formatCurrency(computed.currentAmount)}
          icon={<Wallet size={20} />}
          accent="from-amber-500/5 to-transparent"
          footer={
            <div className="flex items-center justify-between">
              <span>Profit</span>
              <span className="font-medium">
                {formatCurrency(computed.currentProfit)}
              </span>
            </div>
          }
        />

        <StatCard
          title="Current Bonus"
          hint="Based on bonus %"
          value={formatCurrency(computed.currentBonus)}
          icon={<BadgeCheck size={20} />}
          accent="from-violet-500/5 to-transparent"
        />
      </div>

      {/* Breakdown cards */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <TotalsCard
          totalAmount={computed.totalAmount}
          totalProfit={computed.totalProfit}
          totalBonus={computed.totalBonus}
          totalFee={computed.totalFee}
        />
        <ActivityCard b={b} />
      </div>

      {/* Raw JSON (collapsible) */}
      <details className="mt-6">
        <summary className="cursor-pointer select-none text-sm text-gray-500 hover:text-gray-700">
          Show raw boosterConfig (debug)
        </summary>
        <Card className="mt-2">
          <pre className="max-h-[380px] overflow-auto rounded-xl bg-gray-50 p-4 text-xs leading-relaxed">
            {JSON.stringify(b, null, 2)}
          </pre>
        </Card>
      </details>

      <div className="mt-3 flex items-center gap-2">
        <Button onClick={handleDistribute} disabled={isDistributing}>
          {isDistributing ? (
            <span className="inline-flex items-center gap-2">
              <PulseLoader size={6} color="#fff" /> Distributing…
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Coins size={16} /> Distribute Profit (Today)
            </span>
          )}
        </Button>
      </div>

      {/* Edit Modal */}
      <Modal
        show={!!editor.field}
        size="md"
        onClose={isSaving ? undefined : closeEditor}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">
                {editor.field === "boost_percentage"
                  ? "Edit Current Boost %"
                  : "Edit Booster Bonus %"}
              </h3>
              <p className="text-sm text-gray-500">
                Enter a percentage. You can type either <strong>1</strong> for
                1% or <strong>0.01</strong> as a decimal.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">New value</label>
              <TextInput
                type="number"
                step="any"
                min={0}
                value={editor.value}
                onChange={(e) =>
                  setEditor((s) => ({
                    ...s,
                    value: e.target.value,
                    error: undefined,
                  }))
                }
                disabled={isSaving}
              />
              {editor.error ? (
                <p className="text-sm text-red-600">{editor.error}</p>
              ) : null}
            </div>
            <div className="flex justify-end gap-2">
              <Button color="light" onClick={closeEditor} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={saveEditor} disabled={isSaving}>
                {isSaving ? (
                  <span className="inline-flex items-center gap-2">
                    <PulseLoader size={6} color="#fff" /> Saving…
                  </span>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
