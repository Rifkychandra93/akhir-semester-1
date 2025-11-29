"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardAdmin() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [omset, setOmset] = useState(0);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/home");
      return;
    }

    fetch("/api/transactions/getall")
      .then((r) => r.json())
      .then(setTransactions)
      .catch((err) => console.error(err));

    fetch("/api/transactions/omsetToday")
      .then((r) => r.json())
      .then((d) => setOmset(d.omset || 0))
      .catch((err) => console.error(err));
  }, [router]);

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-400 text-white font-poppins relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/clouds.svg')] bg-cover opacity-10"></div>
      <div className="absolute inset-0 bg-white/20 backdrop-blur-lg"></div>

      <div className="relative z-10 max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold drop-shadow">Dashboard Admin</h1>
          <button
            onClick={() => router.push("/home")}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-all shadow-md"
          >
            Kembali ke Home
          </button>
        </div>

        <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 mb-8 shadow-lg text-center">
          <h2 className="text-xl font-semibold text-white/90">Omset Hari Ini (Semua Penjual)</h2>
          <p className="text-3xl font-bold mt-2 drop-shadow">Rp {omset.toLocaleString("id-ID")}</p>
        </div>

        <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 shadow-lg overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4 text-white/90">Semua Transaksi</h3>
          <table className="min-w-full border-collapse text-white/90">
            <thead>
              <tr className="bg-white/20 text-white/80">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Produk</th>
                <th className="px-4 py-2 text-left">Seller</th>
                <th className="px-4 py-2 text-left">Buyer</th>
                <th className="px-4 py-2 text-left">Qty</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-white/70">
                    Belum ada transaksi hari ini.
                  </td>
                </tr>
              ) : (
                transactions.map((t, i) => (
                  <tr
                    key={t.id}
                    className={i % 2 === 0 ? "bg-white/10" : "bg-white/5"}
                  >
                    <td className="px-4 py-2">{t.id}</td>
                    <td className="px-4 py-2">{t.product_name}</td>
                    <td className="px-4 py-2">{t.seller_name}</td>
                    <td className="px-4 py-2">{t.buyer_name}</td>
                    <td className="px-4 py-2">{t.quantity}</td>
                    <td className="px-4 py-2">Rp {t.total_price.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-2">{t.created_at}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
