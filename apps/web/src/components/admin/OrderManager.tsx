import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Order } from "../../types";
import { useLanguage } from "../../context/LanguageContext";

const statuses: Order["status"][] = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

type OrderItem = {
  id: number;
  productName: string;
  unitPrice: number;
  quantity: number;
};

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders");
      setOrders(response.data.data ?? []);
    } catch (err) {
      console.error(err);
      setError(language === "tr" ? "Siparişler yüklenemedi." : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrderItems = async (orderId: number) => {
    setSelectedOrderId(orderId);
    try {
      const response = await api.get(`/orders/${orderId}/items`);
      setOrderItems(response.data.data ?? []);
    } catch (err) {
      console.error(err);
      setOrderItems([]);
    }
  };

  const handleStatusChange = async (orderId: number, status: Order["status"]) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      void fetchOrders();
    } catch (err) {
      console.error(err);
      setError(language === "tr" ? "Durum güncellenemedi." : "Failed to update status.");
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-12">
      <div className="md:col-span-7 space-y-4 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-serif font-light text-brand-brown">
            {language === "tr" ? "Siparişler" : "Orders"}
          </h2>
          <button
            onClick={() => void fetchOrders()}
            className="rounded-full border border-warm-500 px-4 py-2 text-sm font-medium text-warm-600 transition hover:bg-warm-100"
          >
            {language === "tr" ? "Yenile" : "Refresh"}
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="max-h-[480px] overflow-auto">
          <table className="min-w-full divide-y divide-brand-tan/60 text-sm">
            <thead className="bg-brand-beige">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-brand-brown/70">#</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-brown/70">
                  {language === "tr" ? "Müşteri" : "Customer"}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-brown/70">
                  {language === "tr" ? "Tutar" : "Total"}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-brown/70">
                  {language === "tr" ? "Durum" : "Status"}
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-tan/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-brand-brown/70">
                    {language === "tr" ? "Yükleniyor..." : "Loading..."}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className={`cursor-pointer transition hover:bg-brand-beige/40 ${
                      selectedOrderId === order.id ? "bg-brand-beige/60" : ""
                    }`}
                    onClick={() => loadOrderItems(order.id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-brand-brown/80">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-brand-brown">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-brand-brown/60">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-brand-brown/80">
                      {(order.totalAmount / 100).toFixed(2)} TL
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(event) => handleStatusChange(order.id, event.target.value as Order["status"])}
                        className="rounded-full border border-brand-tan bg-brand-beige px-3 py-1 text-xs font-medium text-brand-brown outline-none focus:border-brand-accent"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {language === "tr"
                              ? {
                                  pending: "Beklemede",
                                  paid: "Ödendi",
                                  processing: "Hazırlanıyor",
                                  shipped: "Kargolandı",
                                  delivered: "Teslim Edildi",
                                  cancelled: "İptal",
                                }[status]
                              : status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-brand-brown/60">
                      {new Date(order.createdAt).toLocaleString(language === "tr" ? "tr-TR" : "en-US")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:col-span-5 rounded-3xl bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-serif font-light text-brand-brown">
          {language === "tr" ? "Sipariş Detayı" : "Order Details"}
        </h3>
        {selectedOrderId ? (
          orderItems.length ? (
            <ul className="mt-6 space-y-4">
              {orderItems.map((item) => (
                <li key={item.id} className="rounded-2xl bg-brand-beige/40 p-4">
                  <p className="font-medium text-brand-brown">{item.productName}</p>
                  <p className="text-sm text-brand-brown/70">
                    {language === "tr" ? "Adet" : "Quantity"}: {item.quantity}
                  </p>
                  <p className="text-sm text-brand-brown/70">
                    {language === "tr" ? "Birim Fiyat" : "Unit Price"}: {(item.unitPrice / 100).toFixed(2)} TL
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-brand-brown/70">
              {language === "tr" ? "Ürün bilgisi bulunamadı." : "No item details found."}
            </p>
          )
        ) : (
          <p className="mt-6 text-sm text-brand-brown/70">
            {language === "tr" ? "Bir sipariş seçin." : "Select an order to view details."}
          </p>
        )}
      </div>
    </div>
  );
}

