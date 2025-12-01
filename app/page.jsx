"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Clock, Star, TrendingUp, Filter } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = ["Semua", "Makanan Berat", "Snack", "Minuman", "Dessert"];

  // Hitung jumlah keranjang dari localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  }, []);

  // AMBIL DATA PRODUK DARI DATABASE
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Gagal fetch API");

        const data = await res.json();

        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
          setFilteredProducts(data.products);
        } else {
          console.error("Format API salah:", data);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error("Error load products:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter produk berdasarkan search dan kategori
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "Semua") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  // Tambah ke keranjang
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);

    // Show notification
    const notification = document.createElement("div");
    notification.className =
      "fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce";
    notification.textContent = "✓ Ditambahkan ke keranjang!";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-orange-400 to-red-500 p-2 rounded-xl shadow-lg">
                <img
                  src="/download.png"
                  alt="Logo"
                  className="w-8 h-8 rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Kantin Seistar
                </h1>
                <p className="text-xs text-gray-500">Pesan Makanan Favoritmu</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/history")}
                className="hidden sm:flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg transition-all font-medium"
              >
                <Clock className="w-4 h-4" />
                <span>Riwayat</span>
              </button>

              <button
                onClick={() => router.push("/keranjang")}
                className="relative bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 p-3 rounded-xl transition-all shadow-lg"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari makanan atau minuman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Banner Promo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-linear-to-r from-orange-400 via-red-400 to-pink-400 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                  Promo Hari Ini
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Diskon 20% untuk 3 pembelian!
              </h2>
              <p className="text-white/90">Buruan pesan sebelum kehabisan</p>
            </div>
            <div className="hidden sm:block text-6xl">🎉</div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Menu Tersedia
          </h2>
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">
              {filteredProducts.length} Menu
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "/default-food.jpg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-800">
                      {product.rating || "4.5"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xl font-bold text-orange-600">
                      Rp {product.price.toLocaleString()}
                    </p>
                    {product.stock && (
                      <span className="text-xs text-gray-500">
                        Stok: {product.stock}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    + Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Menu tidak ditemukan
            </h3>
            <p className="text-gray-600">
              Coba cari dengan kata kunci lain atau pilih kategori berbeda
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p className="font-semibold mb-1">Kantin Seistar</p>
            <p>Kantin digital buatan anak RPL</p>
          </div>
        </div>
      </footer>
    </main>
  );
}