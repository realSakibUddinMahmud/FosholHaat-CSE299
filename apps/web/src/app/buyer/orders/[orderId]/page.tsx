'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Leaf, Truck, Building2, Headset, Radar, MapPin } from 'lucide-react';
import { getOrderById, getOrderCopy, getOrderStatusLabel } from '../order-data';

export function BuyerOrderDetailView({ orderId, locale }: { orderId: string; locale: 'bn' | 'en' }) {
  const copy = getOrderCopy(locale);
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{copy.notFoundTitle}</h1>
          <p className="mt-2 text-sm text-slate-500">{copy.notFoundBody}</p>
          <Link
            href="/buyer/orders"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white"
          >
            {copy.backToOrders}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/buyer/orders" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">
              {copy.orderId}: #{order.id}
            </h1>
          </div>
          <div className="text-primary p-2 bg-primary/10 rounded-lg">
            <Leaf size={24} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Status Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Truck size={32} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{copy.status}</p>
                <h2 className="text-2xl font-black text-primary">
                  {getOrderStatusLabel(locale, order.status)}
                </h2>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{copy.estArrival}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{order.estDelivery}</p>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800">
              <h3 className="text-lg font-bold">{copy.items}</h3>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {order.items.map((item, index) => (
                <div key={index} className="p-6 flex items-center gap-6">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100">
                    <img src={order.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      {copy.quantity}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900 dark:text-white">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-primary" size={20} />
                <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">{copy.deliveryAddress}</h3>
              </div>
              <p className="text-slate-900 dark:text-white font-bold leading-relaxed">{order.shippingAddress}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="text-primary" size={20} />
                <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider">{copy.paymentMethod}</h3>
              </div>
              <p className="text-slate-900 dark:text-white font-bold">{order.paymentMethod}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">
                {copy.status}: {copy.verified}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          {/* Pricing Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6">{copy.pricing}</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{copy.subtotal}</span>
                <span className="text-slate-900 dark:text-white font-medium">{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{copy.deliveryFee}</span>
                <span className="text-slate-900 dark:text-white font-medium">{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary font-bold">{copy.bulkSavings}</span>
                <span className="text-primary font-black">-৳400</span>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                <span className="text-slate-900 dark:text-white font-bold">{copy.totalAmount}</span>
                <span className="text-3xl font-black text-primary leading-none">{order.total}</span>
              </div>
            </div>
            <Link
              href={`/buyer/orders/${order.id}/tracking`}
              className="mt-8 w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 shadow-lg shadow-primary/20 transition-all"
            >
              <Radar size={20} />
              {copy.track}
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <button className="w-full flex items-center justify-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors">
              <Headset size={20} />
              {copy.needHelp}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default function BuyerOrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  return <BuyerOrderDetailView orderId={orderId} locale="bn" />;
}
