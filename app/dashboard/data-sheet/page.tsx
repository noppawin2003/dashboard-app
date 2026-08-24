"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Topbar from "@/components/Topbar";

type CampaignData = {
  id: number;
  date: string | null;
  time: string | null;
  campaign: string | null;
  product: string | null;
  gmv: number;
  spend: number;
  orders: number;
};

const emptyForm = {
  date: "",
  time: "",
  campaign: "",
  product: "",
  gmv: "0",
  spend: "0",
  orders: "0",
};

export default function DataSheetPage() {
  const [data, setData] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function loadData() {
    setLoading(true);

    const { data, error } = await supabase
      .from("campaign_data")
      .select("*")
      .order("date", { ascending: false })
      .order("time", { ascending: false });

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      setData(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(row: CampaignData) {
    setEditingId(row.id);

    setForm({
      date: row.date || "",
      time: row.time || "",
      campaign: row.campaign || "",
      product: row.product || "",
      gmv: String(row.gmv ?? 0),
      spend: String(row.spend ?? 0),
      orders: String(row.orders ?? 0),
    });

    setShowForm(true);
  }

  async function saveData() {
    const payload = {
      date: form.date || null,
      time: form.time || null,
      campaign: form.campaign || null,
      product: form.product || null,
      gmv: Number(form.gmv) || 0,
      spend: Number(form.spend) || 0,
      orders: Number(form.orders) || 0,
    };

    if (editingId) {
      const { error } = await supabase
        .from("campaign_data")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("campaign_data")
        .insert(payload);

      if (error) {
        alert(error.message);
        return;
      }
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);

    await loadData();
  }

  async function deleteData(id: number) {
    const confirmed = window.confirm(
      "ต้องการลบข้อมูลรายการนี้หรือไม่?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("campaign_data")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadData();
  }

  return (
    <>
      <Topbar title="Data Sheet" />

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-text-muted">
              Campaign data
            </p>
            <p className="mt-1 text-xs text-text-muted font-mono">
              {data.length} records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-muted hover:bg-surface-2 hover:text-text transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <button
              onClick={openAddForm}
              className="flex items-center gap-2 rounded-md bg-text px-3 py-2 text-sm text-bg hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              Add Data
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-6 rounded-lg border border-border bg-surface p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold">
                {editingId ? "Edit Data" : "Add Data"}
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-text-muted hover:text-text"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Date"
                type="date"
                value={form.date}
                onChange={(value) =>
                  setForm({ ...form, date: value })
                }
              />

              <Input
                label="Time"
                type="time"
                value={form.time}
                onChange={(value) =>
                  setForm({ ...form, time: value })
                }
              />

              <Input
                label="Campaign"
                value={form.campaign}
                onChange={(value) =>
                  setForm({ ...form, campaign: value })
                }
              />

              <Input
                label="Product"
                value={form.product}
                onChange={(value) =>
                  setForm({ ...form, product: value })
                }
              />

              <Input
                label="GMV"
                type="number"
                value={form.gmv}
                onChange={(value) =>
                  setForm({ ...form, gmv: value })
                }
              />

              <Input
                label="Spend"
                type="number"
                value={form.spend}
                onChange={(value) =>
                  setForm({ ...form, spend: value })
                }
              />

              <Input
                label="Orders"
                type="number"
                value={form.orders}
                onChange={(value) =>
                  setForm({ ...form, orders: value })
                }
              />
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={saveData}
                className="rounded-md bg-text px-4 py-2 text-sm text-bg hover:opacity-90"
              >
                {editingId ? "Save Changes" : "Save Data"}
              </button>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-text-muted text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                  <th className="px-5 py-3 font-medium">Campaign</th>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">GMV</th>
                  <th className="px-5 py-3 font-medium">Spend</th>
                  <th className="px-5 py-3 font-medium">Orders</th>
                  <th className="px-5 py-3 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-10 text-center text-text-muted"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-10 text-center text-text-muted"
                    >
                      No campaign data yet.
                    </td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.id}>
                      <td className="px-5 py-4">
                        {row.date || "—"}
                      </td>

                      <td className="px-5 py-4 font-mono text-xs text-text-muted">
                        {row.time || "—"}
                      </td>

                      <td className="px-5 py-4 font-medium">
                        {row.campaign || "—"}
                      </td>

                      <td className="px-5 py-4 text-text-muted">
                        {row.product || "—"}
                      </td>

                      <td className="px-5 py-4 font-mono text-xs">
                        {Number(row.gmv).toLocaleString()}
                      </td>

                      <td className="px-5 py-4 font-mono text-xs">
                        {Number(row.spend).toLocaleString()}
                      </td>

                      <td className="px-5 py-4 font-mono text-xs">
                        {Number(row.orders).toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditForm(row)}
                            className="rounded-md p-2 text-text-muted hover:bg-surface-2 hover:text-text"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => deleteData(row.id)}
                            className="rounded-md p-2 text-text-muted hover:bg-surface-2 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-text-muted">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
      />
    </label>
  );
}