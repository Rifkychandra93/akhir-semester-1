"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function WarungDetail() {
  const { seller } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.products.filter(
          (item) => item.seller.toLowerCase() === seller.toLowerCase()
        );
        setProducts(filtered);
      });
  }, [seller]);

  const addToCart = (item, qty) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exist = cart.find((x) => x.id === item.id);

    if (exist) {
      exist.qty += qty;
    } else {
      cart.push({ ...item, qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setSelected(null);

    Swal.fire({
      title: "Ditambahkan!",
      text: `${item.name} (${qty}x) masuk keranjang.`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      background: "#1E1B4B",
      color: "#fff",
    });
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-400 text-white font-poppins relative overflow-hidden">

      <div className="absolute inset-0 bg-white/20 backdrop-blur-lg"></div>

      <header className="relative z-10 flex items-center justify-between px-8 py-4 bg-white/20 backdrop-blur-xl border-b border-white/30 shadow-lg">
        <div>
          <h1 className="text-2xl font-extrabold drop-shadow">
            Warung {seller}
          </h1>
          <p className="text-white/80">Silahkan pilih menu yang tersedia.</p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg transition-all"
        >
          Kembali
        </button>
      </header>

      <section className="relative z-10 p-10 overflow-y-auto">
        {products.length === 0 ? (
          <p className="text-white/80 animate-pulse text-lg">
            Menu belum tersedia...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-white/20 backdrop-blur-xl p-4 rounded-xl shadow hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-bold text-white text-lg">{item.name}</h3>
                  <p className="text-sm text-white/80 mb-1">
                    Rp {item.price.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelected(item);
                    setQty(1);
                  }}
                  className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg transition-all mt-3"
                >
                  Pilih
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/20 backdrop-blur-xl p-6 rounded-xl shadow-xl w-80 border border-white/30">

            <h2 className="text-xl font-bold text-white mb-3">{selected.name}</h2>

            <div className="flex items-center justify-center gap-4 text-white text-2xl my-4">
              <button
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                className="bg-pink-600 hover:bg-pink-700 px-3 py-1 rounded-lg"
              >
                -
              </button>

              <span>{qty}</span>

              <button
                onClick={() => setQty((prev) => prev + 1)}
                className="bg-pink-600 hover:bg-pink-700 px-3 py-1 rounded-lg"
              >
                +
              </button>
            </div>

            <button
              onClick={() => addToCart(selected, qty)}
              className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg mt-3"
            >
              Masukkan ke Keranjang
            </button>

            <button
              onClick={() => setSelected(null)}
              className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg mt-3"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
