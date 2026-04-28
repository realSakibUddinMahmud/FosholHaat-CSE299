"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { getHubExceptionCopy, type HubExceptionDetail, type HubExceptionListResponse, type HubExceptionStatusTab } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../lib/locale";
import { apiFetch, apiPost } from "../../../lib/api-client";

export default function HubExceptionManagementWeb() {
  const { locale } = useBrowserLocale();
  const copy = getHubExceptionCopy(locale);
  const [list, setList] = useState<HubExceptionListResponse | null>(null);
  const [details, setDetails] = useState<Record<string, HubExceptionDetail>>({});
  const [activeTab, setActiveTab] = useState<HubExceptionStatusTab>("active");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const load = () => apiFetch<HubExceptionListResponse>("/api/hub/exceptions").then(async (data) => {
    setList(data);
    setActiveTab(data.activeTab);
    setSelectedId(data.featuredExceptionId);
    const entries = await Promise.all(data.exceptions.map(async (item) => {
      const detail = await apiFetch<{ exception: HubExceptionDetail }>(`/api/hub/exceptions/${item.exceptionId}`);
      return [item.exceptionId, detail.exception] as const;
    }));
    setDetails(Object.fromEntries(entries));
  });
  useEffect(() => {
    load().catch(() => undefined);
  }, []);
  const items = useMemo(() => (list?.exceptions ?? []).filter((item) => item.statusTab === activeTab), [activeTab, list]);
  const selected = selectedId ? details[selectedId] : null;
  const mutate = async (action: "resolve" | "escalate") => {
    if (!selectedId) return;
    await apiPost(`/api/hub/exceptions/${selectedId}/${action}`, action === "resolve" ? { note: "Resolved from web workspace" } : { targetOwner: "hub-manager" });
    await load();
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      <aside className="w-1/3 flex flex-col border-r border-gray-200 bg-white shadow-sm z-10">
        <header className="p-6 border-b border-gray-100 shrink-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">{copy.screenTitle}</h1>
          <div className="flex gap-2 mt-6 p-1 bg-gray-100 rounded-xl">
            {(["active", "waiting-review", "resolved"] as HubExceptionStatusTab[]).map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 px-3 text-sm font-bold rounded-lg ${activeTab === tab ? "bg-white text-green-700 shadow-sm" : "text-gray-500"}`}>{copy.tabs[tab]}</button>)}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.map((item) => <button key={item.exceptionId} onClick={() => setSelectedId(item.exceptionId)} className={`w-full text-left p-4 rounded-xl border ${selectedId === item.exceptionId ? "border-green-600 bg-green-50/50" : "border-gray-200 bg-white"}`}><div className="flex gap-2"><AlertCircle size={14} /><span className="text-xs font-bold uppercase">{copy.severityLabels[item.severity]}</span></div><h3 className="text-base font-bold">{item.title}</h3><p className="text-sm text-gray-500">{item.lotLabel} - {item.laneLabel}</p></button>)}
          {!items.length ? <p className="p-8 text-center bg-gray-50 border rounded-xl">{copy.listEmptyBody}</p> : null}
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        {selected ? <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border p-8"><div className="mb-4 text-xs font-bold">{selected.exceptionId}</div><h2 className="text-3xl font-extrabold mb-2">{selected.title}</h2><p className="text-gray-600">{selected.description}</p><div className="mt-8 flex gap-3"><button onClick={() => mutate("resolve")} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white">{copy.actionLabels.resolve}</button><button onClick={() => mutate("escalate")} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white border">{copy.actionLabels.escalate}</button></div></div> : <p>Select an exception</p>}
      </main>
    </div>
  );
}
