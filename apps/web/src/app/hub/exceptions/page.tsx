"use client";

import React, { useMemo, useState } from "react";
import { AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { getHubExceptionCopy, type HubExceptionStatusTab } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../lib/locale";
import { HUB_EXCEPTION_DETAILS, HUB_EXCEPTION_LIST } from "./_data";

export default function HubExceptionManagementWeb() {
  const { locale } = useBrowserLocale();
  const copy = getHubExceptionCopy(locale);
  const [activeTab, setActiveTab] = useState<HubExceptionStatusTab>(HUB_EXCEPTION_LIST.activeTab);
  const [selectedId, setSelectedId] = useState<string | null>(HUB_EXCEPTION_LIST.featuredExceptionId);

  const items = useMemo(
    () => HUB_EXCEPTION_LIST.exceptions.filter((item) => item.statusTab === activeTab),
    [activeTab]
  );

  const selected = selectedId ? HUB_EXCEPTION_DETAILS[selectedId] : null;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      {/* Sidebar / Queue Column */}
      <aside className="w-1/3 flex flex-col border-r border-gray-200 bg-white shadow-sm z-10">
        <header className="p-6 border-b border-gray-100 shrink-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">{copy.screenTitle}</h1>
          
          <div className="flex gap-2 mt-6 p-1 bg-gray-100 rounded-xl">
            {(["active", "waiting-review", "resolved"] as HubExceptionStatusTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 text-sm font-bold rounded-lg transition-colors ${
                  activeTab === tab
                    ? "bg-white text-green-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {copy.tabs[tab]}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length ? (
            items.map((item) => (
              <button
                key={item.exceptionId}
                onClick={() => setSelectedId(item.exceptionId)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedId === item.exceptionId
                    ? "border-green-600 bg-green-50/50 ring-1 ring-green-600"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle size={14} className={
                      item.severity === "critical" ? "text-red-500" :
                      item.severity === "high-priority" ? "text-orange-500" : "text-gray-400"
                    } />
                    <span className={`text-xs font-bold uppercase ${
                      item.severity === "critical" ? "text-red-600" :
                      item.severity === "high-priority" ? "text-orange-600" : "text-gray-500"
                    }`}>
                      {copy.severityLabels[item.severity]}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400">{item.createdAgoLabel}</span>
                </div>
                
                <h3 className="text-base font-bold text-gray-900 tracking-tight leading-tight mb-1">{item.title}</h3>
                <p className="text-sm font-medium text-gray-500">{item.lotLabel} &bull; {item.laneLabel}</p>
              </button>
            ))
          ) : (
            <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-xl border-dashed">
              <h3 className="text-gray-900 font-bold mb-1">{copy.listEmptyTitle}</h3>
              <p className="text-sm text-gray-500">{copy.listEmptyBody}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Detail Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        {selected ? (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                  {selected.exceptionId}
                </span>
                <span className="text-sm font-medium text-gray-500">{selected.buyerVisibilityLabel}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">{selected.title}</h2>
              <p className="text-gray-600 text-base leading-relaxed">{selected.description}</p>
            </div>

            <div className="p-8 grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-black uppercase text-gray-400 mb-3 tracking-wider">{copy.source}</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selected.sourceLabel}</p>
                    <p className="text-sm text-gray-500">{selected.lotLabel}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase text-gray-400 mb-3 tracking-wider">{copy.timeline}</h4>
                <div className="space-y-4">
                  {selected.timeline.map((event, idx) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5" />
                        {idx !== selected.timeline.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{event.label}</p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">{event.timeLabel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Recommended Action</p>
                  <p className="text-sm text-gray-600">{selected.nextActionLabel}</p>
                </div>
                <div className="flex gap-3">
                  {selected.actionOptions.map((action) => (
                    <button
                      key={action}
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-transform active:scale-95 ${
                        action === "resolve"
                          ? "bg-green-600 hover:bg-green-700 text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {/* Using cast since it's mock data handling */}
                      {copy.actionLabels[action as keyof typeof copy.actionLabels] || action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <CheckCircle2 size={48} strokeWidth={1.5} className="mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-500">Select an exception to view details</p>
          </div>
        )}
      </main>
    </div>
  );
}
