"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ArrowLeft, Receipt, Calendar, CreditCard, CheckCircle, XCircle, AlertCircle, Package } from "lucide-react";

export default function History() {
  const router = useRouter();
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (ms) => {
    if (ms <= 0) return "00:00";
    let sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // ========================================
  // LISTENER untuk update dari Admin
  // ========================================
  useEffect(() => {
    const handleStorageChange = (e) => {
      console.log("Storage event detected!", e);
      
      const updateStr = localStorage.getItem("update_history");
      if (!updateStr) return;

      try {
        const update = JSON.parse(updateStr);
        console.log("Update from admin:", update);

        setRiwayat(prev => {
          const updated = prev.map(r => {
            // Match by ID atau booking code
            if (String(r.id) === String(update.id) || r.booking === update.booking) {
              console.log("Matched order! Updating status to:", update.status);
              return { 
                ...r, 
                status: update.status, 
                remaining: 0 
              };
            }
            return r;
          });
          
          // Simpan kembali ke localStorage
          localStorage.setItem("riwayat", JSON.stringify(updated));
          return updated;
        });

      } catch (err) {
        console.error("Error parsing update_history:", err);
      }
    };

    // Listen untuk storage event (dari tab lain)
    window.addEventListener("storage", handleStorageChange);
    
    // Listen untuk manual dispatch (dari tab yang sama)
    window.addEventListener("storage", handleStorageChange);

    // Polling setiap 2 detik sebagai backup
    const interval = setInterval(() => {
      const updateStr = localStorage.getItem("update_history");
      if (updateStr) {
        handleStorageChange();
      }
    }, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  async function loadHistory() {
    try {
      const dbReq = await fetch("/api/history");
      const dbRes = await dbReq.json();
      const ls = JSON.parse(localStorage.getItem("riwayat") || "[]");
      
      let merged = [];
      if (dbRes.success) {
        merged = [
          ...dbRes.data.map(o => ({
            id: o.id,
            nama: o.nama_pemesan,
            booking: o.booking_code,
            metode: o.metode,
            total: o.total,
            tanggal: o.tanggal,
            expiredAt: o.expired_at,
            status: o.status,
            remaining: o.expired_at - Date.now(),
          })),
          ...ls,
        ];
      } else {
        merged = ls;
      }
      
      setRiwayat(merged);
    } catch (error) {
      console.error("Error loading history:", error);
      const ls = JSON.parse(localStorage.getItem("riwayat") || "[]");
      setRiwayat(ls);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status, remaining) => {
    if (status === "Kadaluarsa" || remaining <= 0) {
      return (
        <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-semibold">
          <XCircle size={16} />
          <span>Kadaluarsa</span>
        </div>
      );
    } else if (status === "Lunas" || status === "Dibayar") {
      return (
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">
          <CheckCircle size={16} />
          <span>Lunas</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-sm font-semibold">
          <AlertCircle size={16} />
          <span>Menunggu Pembayaran</span>
        </div>
      );
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 md:p-6 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, orange 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-100 mb-6">
          <div className="bg-linear-to-r from-orange-500 to-red-500 p-6">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>Kembali</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Clock size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Riwayat Pemesanan</h1>
                <p className="text-white/90 text-sm">Lihat semua transaksi Anda</p>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="p-6 bg-white grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-linear-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
              <p className="text-2xl font-bold text-orange-600">{riwayat.length}</p>
              <p className="text-xs text-gray-600">Total Transaksi</p>
            </div>
            <div className="text-center p-3 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <p className="text-2xl font-bold text-green-600">
                {riwayat.filter(r => r.status === "Lunas" || r.status === "Dibayar").length}
              </p>
              <p className="text-xs text-gray-600">Berhasil</p>
            </div>
            <div className="text-center p-3 bg-linear-to-br from-red-50 to-rose-50 rounded-xl border border-red-100">
              <p className="text-2xl font-bold text-red-600">
                {riwayat.filter(r => r.status === "Kadaluarsa" || r.remaining <= 0).length}
              </p>
              <p className="text-xs text-gray-600">Kadaluarsa</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : riwayat.length === 0 ? (
          <div className="bg-white shadow-lg rounded-2xl p-12 text-center border border-gray-100">
            <Receipt size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Belum Ada Riwayat
            </h3>
            <p className="text-gray-600 mb-6">
              Anda belum memiliki transaksi pemesanan
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
            >
              Mulai Pesan
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {riwayat.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
              >
                {/* Header Card */}
                <div className="bg-linear-to-r from-orange-50 to-amber-50 p-4 border-b border-orange-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Package size={20} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{item.nama}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                          <Calendar size={12} />
                          <span>{item.tanggal}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(item.status, item.remaining)}
                  </div>
                </div>

                {/* Body Card */}
                <div className="p-4 space-y-3">
                  {/* Booking Code */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Kode Booking</p>
                    <p className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-red-500">
                      {item.booking}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Receipt size={14} />
                        <p className="text-xs">Total</p>
                      </div>
                      <p className="font-bold text-gray-800">
                        Rp {item.total.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <CreditCard size={14} />
                        <p className="text-xs">Metode</p>
                      </div>
                      <p className="font-bold text-gray-800 capitalize">
                        {item.metode === "cash" ? "💵 Cash" : "📱 QRIS"}
                      </p>
                    </div>
                  </div>

                  {/* Countdown / Status */}
                  {item.status !== "Lunas" && item.status !== "Dibayar" && item.remaining > 0 && (
                    <div className="bg-linear-to-r from-orange-500 to-red-500 p-3 rounded-xl text-center">
                      <div className="flex items-center justify-center gap-2 text-white">
                        <Clock size={16} className="animate-pulse" />
                        <p className="text-sm">Waktu Tersisa:</p>
                        <p className="text-lg font-bold tabular-nums">
                          {formatTime(item.remaining)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden shadow-lg">
        <button
          onClick={() => router.push("/")}
          className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg"
        >
          Kembali ke Home
        </button>
      </div>
    </main>
  );
}