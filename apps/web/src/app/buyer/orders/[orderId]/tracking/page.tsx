'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowLeft, Leaf, Truck, CheckCircle2, Box, Calendar, Phone, MessageSquare, Package, MapPin, Radar } from 'lucide-react';
import { getOrderById, getOrderCopy } from '../../order-data';

export function BuyerOrderTrackingView({ orderId, locale }: { orderId: string; locale: 'bn' | 'en' }) {
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
              {copy.tracking}: #{order.id}
            </h1>
          </div>
          <div className="text-primary p-2 bg-primary/10 rounded-lg">
            <Leaf size={24} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="text-xl font-black mb-10 flex items-center gap-3">
              <Radar className="text-primary" size={24} />
              {copy.tracking}
            </h3>

            <div className="relative space-y-0 pl-4">
              <div className="absolute left-8 top-2 bottom-8 w-1 bg-slate-100 dark:bg-slate-800" />

              <div className="flex gap-8 pb-12 relative">
                <div className="relative z-10 size-10 rounded-full bg-primary flex items-center justify-center text-white ring-8 ring-white dark:ring-slate-900">
                  <CheckCircle2 size={24} />
                </div>
                <div className="pt-1">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{copy.orderConfirmed}</h4>
                  <p className="text-sm text-slate-500 mt-1">Oct 24, 2023 • 09:00 AM</p>
                </div>
              </div>

              <div className="flex gap-8 pb-12 relative">
                <div className="relative z-10 size-10 rounded-full bg-primary flex items-center justify-center text-white ring-8 ring-white dark:ring-slate-900">
                  <Box size={20} />
                </div>
                <div className="pt-1">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{copy.packedAtHub}</h4>
                  <p className="text-sm text-slate-500 mt-1">Oct 24, 2023 • 02:30 PM</p>
                </div>
              </div>

              <div className="flex gap-8 pb-12 relative">
                <div className="absolute left-4 top-2 bottom-0 w-1 bg-primary/20" />
                <div className="relative z-10 size-10 rounded-full bg-primary flex items-center justify-center text-white ring-8 ring-primary/20 animate-pulse">
                  <Truck size={20} />
                </div>
                <div className="pt-1">
                  <div className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider mb-2 rounded">
                    {copy.currentlyActive}
                  </div>
                  <h4 className="text-xl font-black text-primary">{copy.inTransit}</h4>
                  <p className="text-base font-bold text-slate-700 dark:text-slate-300 mt-1">
                    {copy.estArrival}: {order.estDelivery}
                  </p>
                </div>
              </div>

              <div className="flex gap-8 relative">
                <div className="relative z-10 size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 ring-8 ring-white dark:ring-slate-900">
                  <Calendar size={20} />
                </div>
                <div className="pt-1">
                  <h4 className="text-lg font-bold text-slate-400">{copy.delivered}</h4>
                  <p className="text-sm text-slate-400 mt-1">Expected soon</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col md:flex-row">
            <div className="p-8 flex-1">
              <h3 className="text-lg font-bold mb-6">{copy.logisticsInfo}</h3>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{copy.truckId}</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">DH-METRO-1234</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{copy.fleet}</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">Foshol Logistics</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                  <Phone size={18} />
                  {copy.callDriver}
                </button>
                <button className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                  <MessageSquare size={18} />
                  {copy.message}
                </button>
              </div>
            </div>
            <div className="md:w-72 bg-slate-200 dark:bg-slate-800 relative min-h-[200px]">
              <div className="absolute inset-0 bg-primary/10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="size-12 bg-primary rounded-full border-4 border-white flex items-center justify-center text-white shadow-xl">
                  <Truck size={24} />
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-black shadow-lg">
                Jamuna Bridge Area
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Package className="text-primary" size={20} />
              {copy.orderSnapshot}
            </h3>

            <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-6">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100">
                <Image
                  src={order.imageUrl}
                  alt={order.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{order.title}</p>
                <p className="text-xl font-black text-primary mt-1">{order.total}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">{copy.deliveryAddress}</p>
                <div className="flex gap-3 text-sm">
                  <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                  <p className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{order.shippingAddress}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{copy.contact}</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Mahbubur Rahman</p>
                <p className="text-sm text-slate-500">+880 1712-XXXXXX</p>
              </div>
            </div>

            <Link
              href={`/buyer/orders/${order.id}`}
              className="mt-8 w-full flex items-center justify-center gap-2 py-4 bg-primary/5 text-primary rounded-xl font-bold hover:bg-primary/10 transition-all"
            >
              {copy.viewOrderDetails}
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default function BuyerOrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  return <BuyerOrderTrackingView orderId={orderId} locale="bn" />;
}
