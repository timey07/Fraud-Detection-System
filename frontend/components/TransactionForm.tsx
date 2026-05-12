"use client";

import { useState } from "react";
import { TransactionPayload } from "@/types";

interface Props {
  onSubmit: (payload: TransactionPayload) => void;
  loading: boolean;
}

const defaultValues: TransactionPayload = {
  userId: "user_001",
  amount: 250,
  merchant: "ShopZone",
  hour: 14,
  deviceTrusted: true,
  geoDistance: 5,
  velocity5m: 1,
  merchantRisk: 0.2,
};

export default function TransactionForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<TransactionPayload>(defaultValues);

  const set = (
    key: keyof TransactionPayload,
    value: string | boolean | number
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...form,
      deviceTrusted: form.deviceTrusted ? 1 : 0,
    });
  };

  return (
    <section className="glass-card overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4">
        <p className="section-label">Transaction Input</p>
        <p className="mt-1 text-sm text-slate-500">
          Submit a payment event to score its risk.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="User ID"
            type="text"
            value={form.userId}
            onChange={(v) => set("userId", v)}
            placeholder="user_001"
          />
          <Field
            label="Amount (USD)"
            type="number"
            value={String(form.amount)}
            onChange={(v) => set("amount", parseFloat(v))}
            placeholder="0.00"
          />
          <Field
            label="Merchant"
            type="text"
            value={form.merchant}
            onChange={(v) => set("merchant", v)}
            placeholder="MerchantName"
          />
          <Field
            label="Hour (0–23)"
            type="number"
            value={String(form.hour)}
            onChange={(v) => set("hour", parseInt(v))}
            placeholder="14"
            min="0"
            max="23"
          />
          <Field
            label="Geo Distance (km)"
            type="number"
            value={String(form.geoDistance)}
            onChange={(v) => set("geoDistance", parseFloat(v))}
            placeholder="0"
          />
          <Field
            label="Velocity (5 min)"
            type="number"
            value={String(form.velocity5m)}
            onChange={(v) => set("velocity5m", parseInt(v))}
            placeholder="1"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Merchant Risk (0–1)</label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={form.merchantRisk}
                onChange={(e) =>
                  set("merchantRisk", parseFloat(e.target.value))
                }
                className="h-2 flex-1 accent-blue-600"
              />
              <span className="w-12 text-right text-sm font-medium text-blue-600">
                {form.merchantRisk.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div>
            <label className="field-label">Device Trusted</label>
            <button
              type="button"
              onClick={() => set("deviceTrusted", !form.deviceTrusted)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition ${
                form.deviceTrusted
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <span className="text-sm text-slate-700">
                {form.deviceTrusted ? "Trusted" : "Untrusted"}
              </span>
              <span
                className={`relative h-6 w-11 rounded-full transition ${
                  form.deviceTrusted ? "bg-emerald-500/70" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                    form.deviceTrusted ? "left-5" : "left-0.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Presets
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setForm(p.payload)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="primary-btn">
          {loading ? "Analyzing transaction..." : "Analyze Transaction"}
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  min,
  max,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={type === "number" ? "any" : undefined}
        className="input-shell"
      />
    </div>
  );
}

const PRESETS: { label: string; payload: TransactionPayload }[] = [
  {
    label: "Safe",
    payload: {
      userId: "user_safe",
      amount: 45,
      merchant: "GroceryMart",
      hour: 10,
      deviceTrusted: true,
      geoDistance: 0.5,
      velocity5m: 1,
      merchantRisk: 0.05,
    },
  },
  {
    label: "Suspicious",
    payload: {
      userId: "user_sus",
      amount: 999,
      merchant: "CryptoExchange",
      hour: 3,
      deviceTrusted: false,
      geoDistance: 450,
      velocity5m: 4,
      merchantRisk: 0.65,
    },
  },
  {
    label: "High Risk",
    payload: {
      userId: "user_fraud",
      amount: 4999,
      merchant: "DarkShop",
      hour: 2,
      deviceTrusted: false,
      geoDistance: 1200,
      velocity5m: 8,
      merchantRisk: 0.95,
    },
  },
];