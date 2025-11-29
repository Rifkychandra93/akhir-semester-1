"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Trash2, Edit, Plus } from "lucide-react";

export default function DashboardPenjual() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    seller: "",
    price: "",
    image: "",
    stock: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");

    if (!role || !username) {
      router.push("/login");
    } else if (role !== "penjual") {
      router.push("/home");
    } else {
      setUser({ role, username });
      const saved = JSON.parse(localStorage.getItem("products")) || [];
      setProducts(saved);
    }
  }, [router]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.name || !form.price || !form.image || !form.stock) {
      Swal.fire({
        title: "Lengkapi data!",
        icon: "warning",
        background: "#1E1B4B",
        color: "#fff",
      });
      return;
    }

    const newProduct = {
      ...form,
      id: Date.now(),
      seller: user.username,
      price: parseInt(form.price),
      stock: parseInt(form.stock),
    };
    setProducts([newProduct, ...products]);
    setForm({ id: null, name: "", seller: "", price: "", image: "", stock: "" });

    Swal.fire({
      title: "Berhasil!",
      text: "Produk ditambahkan",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      background: "#1E1B4B",
      color: "#fff",
    });
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      seller: item.seller,
      price: item.price,
      image: item.image,
      stock: item.stock,
    });
    setIsEditing(true);
  };

  const handleUpdate = () => {
    if (!form.name || !form.price || !form.image || !form.stock) {
      Swal.fire({
        title: "Lengkapi data!",
        icon: "warning",
        background: "#1E1B4B",
        color: "#fff",
      });
      return;
    }

    const updated = products.map((p) =>
      p.id === form.id
        ? { ...p, name: form.name, price: parseInt(form.price), image: form.image, stock: parseInt(form.stock) }
        : p
    );

    setProducts(updated);
    setForm({ id: null, name: "", seller: "", price: "", image: "", stock: "" });
    setIsEditing(false);

    Swal.fire({
      title: "Berhasil!",
      text: "Produk diperbarui",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      background: "#1E1B4B",
      color: "#fff",
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin ingin hapus?",
      text: "Produk akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366F1",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      background: "#1E1B4B",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = products.filter((p) => p.id !== id);
        setProducts(updated);

        Swal.fire({
          title: "Dihapus!",
          text: "Produk berhasil dihapus",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#1E1B4B",
          color: "#fff",
        });
      }
    });
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-400 text-white font-poppins p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold drop-shadow">Dashboard Penjual</h1>
        <button
          onClick={() => router.push("/home")}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-all"
        >
          Kembali
        </button>
      </header>

      <div className="bg-white/20 backdrop-blur-xl p-6 rounded-xl mb-8 shadow-lg max-w-xl">
        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Produk" : "Tambah Produk"}</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Nama Produk"
            value={form.name}
            onChange={handleChange}
            className="p-2 rounded bg-white/30 text-white"
          />
          <input
            type="text"
            name="image"
            placeholder="URL Gambar"
            value={form.image}
            onChange={handleChange}
            className="p-2 rounded bg-white/30 text-white"
          />
          <input
            type="number"
            name="price"
            placeholder="Harga"
            value={form.price}
            onChange={handleChange}
            className="p-2 rounded bg-white/30 text-white"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stok"
            value={form.stock}
            onChange={handleChange}
            className="p-2 rounded bg-white/30 text-white"
          />
          {isEditing ? (
            <button
              onClick={handleUpdate}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold"
            >
              Update Produk
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Tambah Produk
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/30 text-white/90">
              <th className="py-2">Nama</th>
              <th className="py-2">Harga</th>
              <th className="py-2">Stok</th>
              <th className="py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr
                key={item.id}
                className="border-b border-white/20 hover:bg-white/10 transition-all"
              >
                <td className="py-2">{item.name}</td>
                <td className="py-2">Rp {item.price.toLocaleString()}</td>
                <td className="py-2">{item.stock}</td>
                <td className="py-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded-full"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 p-2 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-white/70">
                  Belum ada produk
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
