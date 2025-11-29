"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { 
  ShoppingCart, 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag,
  Package,
  AlertCircle
} from "lucide-react";

export default function KeranjangPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const savedRaw = JSON.parse(localStorage.getItem("cart")) || [];

      // Normalize and merge by id
      const map = new Map();

      for (const entry of savedRaw) {
        const id = entry?.id ?? null;
        if (id == null) continue;

        const qty = Number(entry?.qty ?? entry?.quantity ?? 1) || 1;
        const name = entry?.name ?? entry?.productName ?? "";
        const price = Number(entry?.price ?? 0) || 0;
        const image = entry?.image ?? entry?.img ?? "";

        if (map.has(id)) {
          const prev = map.get(id);
          prev.qty = prev.qty + qty;
          map.set(id, prev);
        } else {
          map.set(id, {
            id,
            name,
            price,
            image,
            qty,
          });
        }
      }

      const normalized = Array.from(map.values());

      localStorage.setItem(
        "cart",
        JSON.stringify(normalized.map((it) => ({ id: it.id, qty: it.qty, name: it.name, price: it.price, image: it.image })))
      );

      setCart(normalized);

      const sum = normalized.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.qty || 0), 0);
      setTotal(sum);
    } catch (error) {
      console.error("Error load cart:", error);
      localStorage.removeItem("cart");
      setCart([]);
      setTotal(0);
    }
  };

  const updateQty = (id, amount) => {
    const updated = cart
      .map((item) =>
        item.id === id ? { ...item, qty: Math.max(0, Number(item.qty || 0) + Number(amount)) } : item
      )
      .filter((item) => item.qty > 0);

    setCart(updated);

    localStorage.setItem(
      "cart",
      JSON.stringify(updated.map((item) => ({ id: item.id, qty: item.qty, name: item.name, price: item.price, image: item.image })))
    );

    const sum = updated.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.qty || 0), 0);
    setTotal(sum);
  };

  const deleteItem = (id) => {
    Swal.fire({
      title: "Hapus item?",
      text: "Item akan dihapus dari keranjang",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      background: "#FFF",
      color: "#000",
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = cart.filter((item) => item.id !== id);

        setCart(updated);
        localStorage.setItem(
          "cart",
          JSON.stringify(updated.map((item) => ({ id: item.id, qty: item.qty, name: item.name, price: item.price, image: item.image })))
        );

        const sum = updated.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.qty || 0), 0);
        setTotal(sum);

        Swal.fire({
          title: "Dihapus!",
          text: "Item berhasil dihapus dari keranjang",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#FFF",
          color: "#000",
        });
      }
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Swal.fire({
        title: "Keranjang Kosong!",
        text: "Tambahkan produk terlebih dahulu",
        icon: "warning",
        background: "#FFF",
        color: "#000",
        confirmButtonColor: "#F97316",
      });
      return;
    }

    router.push("/checkout");
  };

  const clearCart = () => {
    Swal.fire({
      title: "Kosongkan keranjang?",
      text: "Semua item akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, kosongkan",
      cancelButtonText: "Batal",
      background: "#FFF",
      color: "#000",
    }).then((result) => {
      if (result.isConfirmed) {
        setCart([]);
        setTotal(0);
        localStorage.setItem("cart", JSON.stringify([]));

        Swal.fire({
          title: "Berhasil!",
          text: "Keranjang telah dikosongkan",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#FFF",
          color: "#000",
        });
      }
    });
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-orange-400 to-red-500 p-3 rounded-xl shadow-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Keranjang Belanja
                </h1>
                <p className="text-sm text-gray-600">
                  {cart.length} item di keranjang
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-all font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Keranjang Masih Kosong
              </h2>
              <p className="text-gray-600 mb-6">
                Yuk, mulai belanja dan tambahkan produk favoritmu ke keranjang!
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all"
              >
                Mulai Belanja
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Item di Keranjang ({cart.length})
                </h2>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Kosongkan
                  </button>
                )}
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="flex items-center p-4 gap-4">
                    {/* Product Image */}
                    <div className="flex-`shrink-0`">
                      <img
                        src={item.image || "/default-food.jpg"}
                        alt={item.name || "Produk"}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">
                        {item.name || "Produk"}
                      </h3>
                      <p className="text-orange-600 font-semibold mb-3">
                        Rp {Number(item.price || 0).toLocaleString()}
                      </p>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="bg-orange-100 hover:bg-orange-200 text-orange-600 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="font-semibold text-gray-800 w-8 text-center">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="bg-orange-100 hover:bg-orange-200 text-orange-600 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        <div className="ml-auto text-right">
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="font-bold text-gray-800">
                            Rp {(Number(item.price || 0) * Number(item.qty || 0)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="flex-`shrink-0` bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-xl transition-all"
                      title="Hapus"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-500" />
                  Ringkasan Belanja
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} item)</span>
                    <span className="font-semibold">
                      Rp {Number(total || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Biaya Layanan</span>
                    <span className="font-semibold text-green-600">Gratis</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-orange-600">
                        Rp {Number(total || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Lanjut ke Pemesanan
                </button>

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-`shrink-0` mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Info Penting</p>
                      <p>Pastikan kamu sudah memeriksa pesanan dengan benar sebelum melanjutkan.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">Total Belanja</p>
              <p className="text-xl font-bold text-orange-600">
                Rp {Number(total || 0).toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}