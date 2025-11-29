"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const [role, setRole] = useState("penjual");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!username || !password) {
        Swal.fire("Oops!", "Lengkapi semua data terlebih dahulu!", "warning");
        return;
      }

      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
      await Swal.fire("Berhasil!", `Akun ${role} berhasil dibuat!`, "success");
      router.push("/login");
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal!", "Terjadi kesalahan saat register!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-linear-to-br from-indigo-500 via-purple-500 to-pink-400">
      <div className="absolute inset-0 bg-[url('/clouds.svg')] bg-cover opacity-10"></div>
      <div className="absolute inset-0 bg-white/20 backdrop-blur-lg"></div>

      <motion.div
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 200 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mx-auto p-6"
      >
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="hidden md:flex w-1/2 justify-center items-center relative"
        >
          <div className="absolute w-80 h-80 bg-indigo-400/30 blur-3xl rounded-full -top-16 left-0"></div>
          <img
            src="@/public/download.png"
            alt="Ilustrasi registrasi"
            className="relative z-10 rounded-3xl drop-shadow-2xl"
            width={450}
            height={450}
          />
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full md:w-1/2 bg-white/30 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/40"
        >
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 bg-indigo-600 rounded-sm mr-2"></div>
            <span className="font-semibold text-indigo-900 text-lg tracking-wide">
              Kantin Sekolah
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-indigo-900 mb-2">
            Buat Akun Baru 
          </h1>
          <p className="text-indigo-700/80 mb-6 text-sm font-medium">
            Hanya admin & penjual yang dapat membuat akun.
          </p>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-indigo-800 mb-1">
                Pilih Role:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-indigo-300/40 bg-white/50 rounded-xl p-3 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="penjual">Penjual</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-800 mb-1">
                Username:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-indigo-300/40 bg-white/50 rounded-xl p-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Masukkan username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-800 mb-1">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-pink-300/40 bg-white/50 rounded-xl p-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Masukkan password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white font-semibold py-3 rounded-xl transition-all shadow-md`}
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="text-center text-indigo-800 text-sm mt-8">
            Sudah punya akun?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-indigo-900 font-semibold hover:underline"
            >
              Login Sekarang
            </button>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
