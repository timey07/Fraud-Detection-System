"use client";

import { useState } from "react";
import { FraudResult } from "@/types";

interface Props {
  result: FraudResult | null;
  loading: boolean;
  error: string | null;
}

export default function ResultPanel({ result, loading, error }: Props) {
  return (
    <section className="glass-card overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4">
        <p className="section-label">Fraud Analysis Result</p>
        <p className="mt-1 text-sm text-slate-500">
          ML score, anomaly signal, and final decision.
        </p>
      </div>

      <div className="p-6">
        {!result && !loading && !error && <EmptyState />}
        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}
        {result && !loading && <ResultView result={result} />}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-white">
        <div className="h-5 w-5 rounded-full bg-blue-500/80" />
      </div>
      <p className="text-sm font-medium text-slate-700">Awaiting transaction</p>
      <p className="mt-2 max-w-xs text-sm text-slate-500">
        Submit a transaction on the left to view the AI fraud analysis here.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
      <p className="mt-4 text-sm font-medium text-slate-700">
        Analyzing transaction
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Feature extraction · anomaly detection · decisioning
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-rose-200 bg-rose-50 text-center">
      <p className="text-sm font-semibold text-rose-600">Connection Error</p>
      <p className="mt-2 max-w-md text-sm text-slate-500">{message}</p>
      <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-400">
        Check backend on port 5000
      </p>
    </div>
  );
}

function ResultView({ result }: { result: FraudResult }) {
  const payload = result.data ?? result;

  const fraudPct = Math.round(
    (payload.fraudProbability ?? payload.fraud_probability ?? 0) * 100
  );

  const anomalyScore = payload.anomalyScore ?? payload.anomaly_score ?? 0;
  const riskLevel = payload.riskLevel ?? payload.risk_level ?? "unknown";
  const decision = payload.decision ?? "UNKNOWN";
  const reasons = payload.reasons ?? [];
  const reviewStatus = payload.reviewStatus ?? payload.review_status ?? null;

  const transactionId =
    payload.transactionId ?? payload.transaction_id ?? payload.id ?? null;

  return (
    <div className="space-y-5">
      {transactionId && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          TXN ID: <span className="font-mono text-slate-700">{transactionId}</span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Fraud Probability
            </p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">
              {fraudPct}%
            </p>
          </div>
          <Badge label={String(decision).toUpperCase()} tone={decisionTone(decision)} />
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${fraudPct}%`,
              background:
                fraudPct < 30
                  ? "linear-gradient(90deg, #22c55e, #3b82f6)"
                  : fraudPct < 60
                  ? "linear-gradient(90deg, #f59e0b, #fb7185)"
                  : "linear-gradient(90deg, #fb7185, #ef4444)",
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Anomaly Score" value={Number(anomalyScore).toFixed(3)} />
        <Metric label="Risk Level" value={String(riskLevel).toUpperCase()} />
        <Metric label="Decision" value={String(decision).toUpperCase()} />
      </div>

      {reasons.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Risk Signals
          </p>
          <div className="mt-3 space-y-2">
            {reasons.map((r: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviewStatus && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Review Status
          </span>
          <span className="text-sm font-medium text-slate-700">
            {String(reviewStatus).toUpperCase()}
          </span>
        </div>
      )}

      <RawJSON data={result} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function Badge({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "amber" | "red" | "slate";
}) {
  const map = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-rose-200 bg-rose-50 text-rose-700",
    slate: "border-slate-200 bg-slate-100 text-slate-700",
  } as const;

  return <span className={`chip ${map[tone]}`}>{label}</span>;
}

function RawJSON({ data }: { data: FraudResult }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-xs uppercase tracking-[0.25em] text-slate-500 transition hover:text-slate-700"
      >
        {open ? "Hide" : "Show"} raw JSON
      </button>
      {open && (
        <pre className="mt-3 max-h-56 overflow-auto rounded-2xl border border-slate-200 bg-slate-900 p-4 text-xs leading-6 text-slate-100">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

function decisionTone(decision: string): "green" | "amber" | "red" | "slate" {
  const d = String(decision).toLowerCase();

  if (d === "approved" || d === "approve") return "green";
  if (d === "flagged" || d === "review") return "amber";
  if (d === "blocked" || d === "block" || d === "rejected") return "red";

  return "slate";
}