"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, CreditCard, Clock, CheckCircle, XCircle, ArrowLeft, User } from "lucide-react";

export default function Checkout() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [nama, setNama] = useState("");
  const [metode, setMetode] = useState("cash");

  const [booking, setBooking] = useState(null);
  const [expiredAt, setExpiredAt] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [expired, setExpired] = useState(false);

  // Load cart
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(data);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const generateBooking = () => "BK" + Math.floor(Math.random() * 900000 + 100000);

  // Countdown
  useEffect(() => {
    if (!expiredAt) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = expiredAt - now;

      if (diff <= 0) {
        setExpired(true);
        setRemaining(0);
        clearInterval(timer);
      } else {
        setRemaining(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiredAt]);

  const formatTime = (ms) => {
    let sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleBayar = async () => {
    if (!nama.trim()) return alert("Nama wajib diisi!");
  
    const kode = generateBooking();
    const expire = Date.now() + 5 * 60 * 1000;
    const tanggal = new Date().toLocaleString();
  
    setBooking(kode);
    setExpiredAt(expire);
  
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking: kode,
          nama,
          metode,
          total,
          expiredAt: expire,
          tanggal,
          cart,
        }),
      });
  
      const data = await res.json();
      if (!data.success) {
        alert("Gagal menyimpan transaksi ke database!");
        return;
      }
  
      // === Simpan LocalStorage ===
      const riwayat = JSON.parse(localStorage.getItem("riwayat") || "[]");
  
      riwayat.push({
        id: Date.now(),
        booking: kode,
        nama,
        metode,
        total,
        cart,
        tanggal,
        expiredAt: expire,
        status: "Belum Dibayar",
      });
  
      localStorage.setItem("riwayat", JSON.stringify(riwayat));
  
    } catch (err) {
      console.log(err);
      alert("Terjadi kesalahan server!");
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 md:p-6 relative">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, orange 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">

        {!booking && (
          <div className="bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-100">
            
            <div className="bg-linear-to-r from-orange-500 to-red-500 p-6">
              <button
                onClick={() => router.push("/keranjang")}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft size={20} />
                <span>Kembali</span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Checkout</h1>
                  <p className="text-white/90 text-sm">Selesaikan pesanan Anda</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6 bg-white">
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-semibold text-sm text-gray-700">
                  <User size={18} className="text-orange-500" />
                  Nama Pemesan
                </label>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl text-gray-900 bg-gray-50 border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-all placeholder-gray-400"
                  placeholder="Masukkan nama Anda..."
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <h2 className="font-semibold flex items-center gap-2 text-gray-800">
                  <ShoppingBag size={18} className="text-orange-500" />
                  Pesanan Anda
                </h2>
                
                {cart.length === 0 ? (
                  <div className="bg-gray-50 p-6 rounded-xl text-center text-gray-500 border border-gray-200">
                    <ShoppingBag size={48} className="mx-auto mb-2 opacity-30" />
                    <p>Keranjang masih kosong</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {cart.map((item, i) => (
                      <div
                        key={i}
                        className="bg-linear-to-r from-orange-50 to-amber-50 p-4 rounded-xl flex justify-between items-center hover:shadow-md transition-all border border-orange-100"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                        </div>
                        <span className="font-bold text-lg text-orange-600">
                          Rp {(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-linear-to-r from-orange-500 to-red-500 p-4 rounded-xl shadow-lg">
                <div className="flex justify-between items-center text-white">
                  <span className="text-lg font-semibold">Total Pembayaran</span>
                  <span className="text-2xl font-bold">
                    Rp {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 font-semibold text-sm text-gray-700">
                  <CreditCard size={18} className="text-orange-500" />
                  Metode Pembayaran
                </label>
                <select
                  className="w-full p-4 rounded-xl text-gray-900 bg-gray-50 border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-all cursor-pointer"
                  value={metode}
                  onChange={(e) => setMetode(e.target.value)}
                >
                  <option value="cash">💵 Cash</option>
                  <option value="qris">📱 QRIS</option>
                </select>
              </div>

              <button
                onClick={handleBayar}
                disabled={cart.length === 0}
                className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-lg"
              >
                {cart.length === 0 ? "Keranjang Kosong" : "Bayar Sekarang"}
              </button>
            </div>
          </div>
        )}

        {booking && (
          <div className="bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-100">
            
            {!expired ? (
              <>
                <div className="bg-linear-to-r from-green-500 to-emerald-600 p-6 text-center">
                  <CheckCircle size={64} className="mx-auto mb-3 animate-bounce text-white" />
                  <h2 className="font-bold text-2xl text-white">Menunggu Pembayaran</h2>
                  <p className="text-white/90 text-sm mt-1">Silakan selesaikan pembayaran Anda</p>
                </div>

                <div className="p-6 space-y-6 bg-white">
                  
                  <div className="bg-linear-to-r from-orange-50 to-amber-50 p-6 rounded-2xl text-center border-2 border-dashed border-orange-300">
                    <p className="text-sm text-gray-600 mb-2">Kode Booking Anda</p>
                    <p className="text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-red-500 mb-2">
                      {booking}
                    </p>
                    <p className="text-xs text-gray-500">Tunjukkan kode ini saat pembayaran</p>
                  </div>
                  <div className="bg-linear-to-r from-orange-500 to-red-500 p-4 rounded-xl shadow-lg flex items-center justify-center gap-3">
                    <Clock size={24} className="animate-pulse text-white" />
                    <div className="text-center">
                      <p className="text-sm text-white/90">Waktu Tersisa</p>
                      <p className="text-3xl font-bold text-white tabular-nums">
                        {formatTime(remaining)}
                      </p>
                    </div>
                  </div>

                  {metode === "qris" && (
                    <div className="bg-gray-50 p-6 rounded-2xl text-center space-y-4 border border-gray-200">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <CreditCard size={20} className="text-orange-500" />
                        <p className="font-semibold text-lg text-gray-800">Scan QRIS</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl inline-block shadow-md border border-gray-200">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Pembayaran%20Kantin"
                          className="w-48 h-48 rounded-lg"
                          alt="QRIS Code"
                        />
                      </div>
                      
                      <div className="bg-linear-to-r from-orange-500 to-red-500 p-3 rounded-lg shadow-md">
                        <p className="text-sm text-white/90">Total Pembayaran</p>
                        <p className="text-2xl font-bold text-white">
                          Rp {total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {metode === "cash" && (
                    <div className="bg-linear-to-r from-orange-50 to-amber-50 p-6 rounded-2xl text-center border border-orange-200">
                      <p className="text-5xl mb-3">💵</p>
                      <p className="font-semibold text-lg text-gray-800">Pembayaran Cash</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Tunjukkan kode booking di kasir
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="bg-linear-to-r from-red-500 to-rose-600 p-6 text-center">
                  <XCircle size={64} className="mx-auto mb-3 text-white" />
                  <h2 className="font-bold text-2xl text-white">Pembayaran Kadaluarsa!</h2>
                  <p className="text-white/90 text-sm mt-1">Waktu pembayaran telah habis</p>
                </div>

                <div className="p-6 text-center bg-white">
                  <p className="text-gray-700 mb-6">
                    Maaf, waktu pembayaran Anda telah habis. Silakan lakukan pemesanan ulang.
                  </p>
                </div>
              </>
            )}

            <div className="p-6 pt-0 bg-white">
              <button
                onClick={() => router.push("/")}
                className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Kembali ke Home
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}