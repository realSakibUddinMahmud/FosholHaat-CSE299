'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Leaf, ChevronRight, Truck, Package, Clock } from 'lucide-react';
import { MOCK_ORDERS, getOrderCopy, getOrderStatusLabel } from './order-data';

export default function BuyerOrdersPage() {
  const locale = 'bn'; // Mocked
  const copy = getOrderCopy(locale);
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'completed'>('ongoing');

  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'ongoing') return ['PROCESSING', 'IN_TRANSIT', 'SHIPPED'].includes(order.status);
    if (activeTab === 'completed') return order.status === 'DELIVERED';
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Leaf size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">{copy.title}</h1>
              <p className="text-sm text-slate-500 mt-1">{copy.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800 mb-8">
          {(['all', 'ongoing', 'completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold transition-all border-b-2 ${
                activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {copy[tab]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row"
            >
              <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden">
                <img
                  src={order.imageUrl}
                  alt={order.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'IN_TRANSIT' ? 'bg-green-100 text-green-700' :
                          order.status === 'PROCESSING' ? 'bg-slate-100 text-slate-500' :
                          'bg-primary text-white'
                        }`}>
                          {getOrderStatusLabel(locale, order.status)}
                        </span>
                        <span className="text-slate-400 text-xs font-medium">#{order.id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{order.title}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase font-bold">{copy.total}</p>
                      <p className="text-xl font-black text-primary">{order.total}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      <span>{copy.date}: {order.dateGroup}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck size={16} />
                      <span>{copy.estArrival}: {order.estDelivery}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                  <Link
                    href={`/buyer/orders/${order.id}/tracking`}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl font-bold text-sm hover:bg-primary/10 transition-colors"
                  >
                    {copy.track}
                    <ChevronRight size={16} />
                  </Link>
                  <Link
                    href={`/buyer/orders/${order.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    {copy.viewDetails}
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <Package size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No orders found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
