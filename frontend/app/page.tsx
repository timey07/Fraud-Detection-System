"use client";

import { useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import ResultPanel from "@/components/ResultPanel";
import { FraudResult, TransactionPayload } from "@/types";

export default function Home() {
  const [result, setResult] = useState<FraudResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload: TransactionPayload) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server error: ${res.status}`);
      }

      const data: FraudResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="glass-card mb-6 flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 ring-1 ring-blue-200">
              <div className="h-5 w-5 rounded-full bg-blue-500" />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-wide text-slate-900">
                SentinelIQ
              </p>
              <p className="text-sm text-slate-600">
                AI-powered transaction intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.45)]" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              System Online
            </span>
          </div>
        </header>

        <section className="mb-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="glass-card p-8">
            <p className="section-label mb-4">Transaction Risk Console</p>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Score transactions in real time with ML-driven fraud intelligence.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Submit a payment event, inspect fraud probability, anomaly score,
              and decision output, then keep every case stored for audit and
              review.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="chip border-emerald-200 bg-emerald-50 text-emerald-700">
                Real-time scoring
              </span>
              <span className="chip border-blue-200 bg-blue-50 text-blue-700">
                Explainable AI
              </span>
              <span className="chip border-amber-200 bg-amber-50 text-amber-700">
                Analyst review
              </span>
            </div>
          </div>

          <div className="glass-card p-6">
            <p className="section-label mb-4">Live Summary</p>

            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Mode" value="Active" />
              <MiniStat label="Pipeline" value="Healthy" />
              <MiniStat label="Latency" value="Low" />
              <MiniStat label="Audit" value="Enabled" />
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <TransactionForm onSubmit={handleSubmit} loading={loading} />
          <ResultPanel result={result} loading={loading} error={error} />
        </section>
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}