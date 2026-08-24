```tsx
"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";

type Report = {
  id: number;
  date: string;
  time: string;
  campaign: string;
  gmv: number | null;
  spend: number | null;
  orders: number | null;
};

const TIMES = ["11:30", "16:00"];

export default function DataSheetPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("11:30");
  const [campaign] = useState("U25");

  const [spend, setSpend] = useState("");
  const [gmv, setGmv] = useState("");
  const [orders, setOrders] = useState("");

  async function loadReports() {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/data-sheet?campaign=U25",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("โหลดข้อมูลไม่สำเร็จ");
      }

      const result = await response.json();

      setReports(result.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  function resetForm() {
    setDate("");
    setTime("11:30");
    setSpend("");
    setGmv("");
    setOrders("");
  }

  async function handleSave() {
    if (!date) {
      alert("กรุณาเลือกวันที่");
      return;
    }

    if (!time) {
      alert("กรุณาเลือกเวลา");
      return;
    }

    if (!spend || !gmv || !orders) {
      alert("กรุณากรอก งบที่ใช้ไป / ยอดขาย / order ให้ครบ");
      return;
    }

    const spendValue = Number(spend);
    const gmvValue = Number(gmv);
    const ordersValue = Number(orders);

    if (
      !Number.isFinite(spendValue) ||
      !Number.isFinite(gmvValue) ||
      !Number.isFinite(ordersValue)
    ) {
      alert("กรุณาตรวจสอบตัวเลข");
      return;
    }

    if (spendValue < 0 || gmvValue < 0 || ordersValue < 0) {
      alert("ตัวเลขต้องไม่ติดลบ");
      return;
    }

    if (ordersValue === 0) {
      alert("order ต้องมากกว่า 0");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/data-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          time,
          campaign,
          spend: spendValue,
          gmv: gmvValue,
          orders: ordersValue,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "บันทึกข้อมูลไม่สำเร็จ"
        );
      }

      alert("บันทึกสำเร็จ และส่งข้อมูลเข้า Google Sheets แล้ว");

      resetForm();
      setShowAdd(false);

      await loadReports();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาด"
      );
    } finally {
      setSaving(false);
    }
  }

  function formatNumber(
    value: number | null | undefined,
    digits = 2
  ) {
    if (value === null || value === undefined) {
      return "—";
    }

    return value.toLocaleString("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  }

  function calculateKpi(report: Report) {
    const spendValue = Number(report.spend ?? 0);
    const gmvValue = Number(report.gmv ?? 0);
    const ordersValue = Number(report.orders ?? 0);

    const cpa =
      ordersValue > 0
        ? spendValue / ordersValue
        : 0;

    const adsPercent =
      gmvValue > 0
        ? (spendValue / gmvValue) * 100
        : 0;

    const roas =
      spendValue > 0
        ? gmvValue / spendValue
        : 0;

    const averageBill =
      ordersValue > 0
        ? gmvValue / ordersValue
        : 0;

    return {
      cpa,
      adsPercent,
      roas,
      averageBill,
    };
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Topbar title="Data Sheet" />

      <main className="flex-1 p-4 md:p-6">
        {/* Page Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold">
              Campaign Reports
            </h2>

            <p className="mt-1 text-xs text-text-muted">
              U25 GMV
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="rounded-md bg-text px-3 py-2 text-xs font-medium text-bg transition-opacity hover:opacity-80"
          >
            + Add
          </button>
        </div>

        {/* Reports */}
        {loading ? (
          <div className="rounded-lg border border-border bg-surface p-8 text-center">
            <p className="text-sm text-text-muted">
              กำลังโหลดข้อมูล...
            </p>
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-10 text-center">
            <p className="text-sm text-text-muted">
              ยังไม่มีรายงาน
            </p>

            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="mt-3 text-xs text-text underline underline-offset-4"
            >
              + เพิ่มรายงานแรก
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {reports.map((report) => {
              const kpi = calculateKpi(report);

              return (
                <section
                  key={report.id}
                  className="overflow-hidden rounded-lg border border-border bg-surface"
                >
                  {/* Date */}
                  <div className="border-b border-border px-3 py-2">
                    <p className="font-mono text-xs text-text-muted">
                      {formatDate(report.date)}
                    </p>
                  </div>

                  {/* Time Bar */}
                  <div className="border-b border-border bg-surface-2 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold">
                        {report.time}
                      </span>

                      <div className="h-px flex-1 bg-border" />
                    </div>
                  </div>

                  {/* U25 */}
                  <div className="p-2">
                    <div className="mx-auto w-full overflow-hidden rounded-md border border-border">
                      {/* U Header */}
                      <div className="border-b border-border bg-surface-2 px-3 py-2 text-center">
                        <span className="font-display text-xs font-semibold">
                          U25
                        </span>
                      </div>

                      {/* KPI */}
                      <div className="divide-y divide-border">
                        <KpiRow
                          label="งบที่ใช้ไป"
                          value={formatNumber(report.spend)}
                        />

                        <KpiRow
                          label="CPA"
                          value={formatNumber(kpi.cpa)}
                        />

                        <KpiRow
                          label="ยอดขาย"
                          value={formatNumber(report.gmv, 0)}
                        />

                        <KpiRow
                          label="%ads"
                          value={`${kpi.adsPercent.toFixed(2)}%`}
                        />

                        <KpiRow
                          label="ROAS (เท่า)"
                          value={kpi.roas.toFixed(2)}
                        />

                        <KpiRow
                          label="order"
                          value={formatNumber(
                            report.orders,
                            0
                          )}
                        />

                        <KpiRow
                          label="เฉลี่ยบิล"
                          value={formatNumber(
                            kpi.averageBill
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-surface p-5 shadow-xl">
            {/* Modal Header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold">
                  Add Report
                </h3>

                <p className="mt-1 text-xs text-text-muted">
                  U25 GMV
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  resetForm();
                }}
                className="text-lg leading-none text-text-muted hover:text-text"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Date */}
              <Field label="วันที่">
                <input
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  className="input"
                />
              </Field>

              {/* Time */}
              <Field label="เวลา">
                <select
                  value={time}
                  onChange={(event) =>
                    setTime(event.target.value)
                  }
                  className="input"
                >
                  {TIMES.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              {/* U */}
              <Field label="U">
                <select
                  value={campaign}
                  disabled
                  className="input cursor-not-allowed opacity-70"
                >
                  <option value="U25">
                    U25
                  </option>
                </select>
              </Field>

              {/* Spend */}
              <Field label="งบที่ใช้ไป">
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={spend}
                  onChange={(event) =>
                    setSpend(event.target.value)
                  }
                  placeholder="0.00"
                  className="input"
                />
              </Field>

              {/* GMV */}
              <Field label="ยอดขาย">
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={gmv}
                  onChange={(event) =>
                    setGmv(event.target.value)
                  }
                  placeholder="0.00"
                  className="input"
                />
              </Field>

              {/* Orders */}
              <Field label="order">
                <input
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min="0"
                  value={orders}
                  onChange={(event) =>
                    setOrders(event.target.value)
                  }
                  placeholder="0"
                  className="input"
                />
              </Field>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  resetForm();
                }}
                disabled={saving}
                className="rounded-md border border-border px-4 py-2 text-xs text-text-muted hover:text-text disabled:opacity-50"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-text px-4 py-2 text-xs font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "กำลังบันทึก..."
                  : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid var(--border);
          background: var(--surface-2);
          color: var(--text);
          border-radius: 6px;
          padding: 9px 10px;
          font-size: 13px;
          outline: none;
        }

        .input:focus {
          border-color: var(--text-muted);
        }

        .input:disabled {
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

function KpiRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-2 items-center px-3 py-2 text-xs">
      <span className="text-text-muted">
        {label}
      </span>

      <span className="text-right font-mono font-medium">
        {value}
      </span>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-text-muted">
        {label}
      </span>

      {children}
    </label>
  );
}

function formatDate(dateString: string) {
  if (!dateString) return "—";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
```
