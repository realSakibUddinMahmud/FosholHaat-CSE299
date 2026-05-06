"use client";

import type { BuyerOrderDetail } from "@fosholhaat/types";

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

export function downloadOrderInvoice(order: BuyerOrderDetail) {
  const rows = order.items
    .map(
      (item) => `<tr><td>${esc(item.name)}<small>${esc(item.sellerName ?? "")}</small></td><td>${esc(item.quantity)}</td><td>${esc(item.price)}</td></tr>`,
    )
    .join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>FosholHaat Invoice ${esc(order.id)}</title><style>
body{font-family:Inter,Arial,sans-serif;color:#0f172a;margin:0;background:#f8fafc}.sheet{max-width:860px;margin:32px auto;background:#fff;border:1px solid #dbe5df;border-radius:18px;padding:32px}.brand{display:flex;justify-content:space-between;gap:24px;border-bottom:2px solid #064e2e;padding-bottom:20px}.logo{font-size:24px;font-weight:900;color:#064e2e}.muted{color:#64748b;font-size:13px}.pill{display:inline-block;background:#dcfce7;color:#064e2e;border-radius:999px;padding:6px 10px;font-weight:800;font-size:12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0}.box{border:1px solid #e2e8f0;border-radius:12px;padding:16px}h1{margin:0 0 6px;font-size:30px}h2{font-size:15px;margin:0 0 10px;color:#064e2e}table{width:100%;border-collapse:collapse;margin-top:16px}th{text-align:left;font-size:12px;color:#64748b;border-bottom:1px solid #e2e8f0;padding:10px}td{padding:14px 10px;border-bottom:1px solid #eef2f7;font-weight:700}small{display:block;color:#64748b;font-weight:500;margin-top:3px}.total{margin-left:auto;width:320px;margin-top:18px}.total div{display:flex;justify-content:space-between;padding:8px 0}.grand{font-size:22px;color:#064e2e;font-weight:900;border-top:1px solid #e2e8f0;margin-top:8px;padding-top:14px!important}@media print{body{background:#fff}.sheet{margin:0;border:0;border-radius:0}}</style></head><body><main class="sheet"><section class="brand"><div><div class="logo">FosholHaat</div><div class="muted">Bogura to Dhaka produce commerce</div></div><div><span class="pill">${esc(order.orderType)} ORDER</span><h1>Invoice</h1><div class="muted">#${esc(order.id)} · ${esc(order.dateGroup)}</div></div></section><section class="grid"><div class="box"><h2>Buyer reception</h2><div>${esc(order.shippingAddress)}</div><div class="muted">${esc(order.paymentMethod)}</div></div><div class="box"><h2>Status</h2><div>${esc(order.status)}</div><div class="muted">${esc(order.paymentStatus)}</div></div></section><table><thead><tr><th>Item</th><th>Quantity</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table><section class="total"><div><span>Subtotal</span><strong>${esc(order.subtotal)}</strong></div><div><span>Logistics & handling</span><strong>${esc(order.deliveryFee)}</strong></div><div class="grand"><span>Total</span><span>${esc(order.total)}</span></div></section></main></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `fosholhaat-invoice-${order.id}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
