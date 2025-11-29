// pages/penjual/[id].jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SellerPage() {
  const router = useRouter();
  const { id } = router.query;
  const [menu, setMenu] = useState([]);
  const [buyer, setBuyer] = useState("");

  useEffect(() => {
    const u = localStorage.getItem("username") || "";
    setBuyer(u);
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/menu/getbySeller?seller_id=${id}`)
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch(console.error);
  }, [id]);

  async function handleBuy(product) {
    const buyerName = buyer || prompt("Masukkan nama pembeli (atau username):");
    if (!buyerName) return;
    const qty = Number(prompt("Jumlah beli:", "1"));
    if (!qty || qty <= 0) return alert("Jumlah tidak valid");

    const res = await fetch("/api/transactions/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: product.id,
        seller_id: id,
        buyer_name: buyerName,
        quantity: qty,
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Berhasil beli. Total: Rp " + data.total_price);
    } else {
      alert(data.message || "Gagal beli");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fef9c3, #fde68a)",
        padding: "40px 20px",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <button
        onClick={() => router.push("/home")}
        style={{
          background: "#94a3b8",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "25px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          transition: "0.2s",
        }}
      >
        Kembali
      </button>

      <h2
        style={{
          color: "#b45309",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Produk 
      </h2>

      {menu.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b7280" }}>
          Belum ada dagangan.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {menu.map((m) => (
            <div
              key={m.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                padding: "16px",
                textAlign: "center",
                transition: "0.3s",
              }}
            >
              {m.gambar ? (
                <img
                  src={m.gambar}
                  alt={m.nama}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    background: "#e5e7eb",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9ca3af",
                    fontSize: "14px",
                  }}
                >
                  (Tidak ada gambar)
                </div>
              )}

              <h3 style={{ color: "#78350f", margin: "8px 0" }}>{m.nama}</h3>
              <p style={{ color: "#b45309", fontWeight: "bold" }}>
                Rp {m.harga}
              </p>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  margin: "6px 0 12px",
                }}
              >
                {m.deskripsi}
              </p>

              <button
                onClick={() => handleBuy(m)}
                style={{
                  background: "linear-gradient(90deg, #f59e0b, #d97706)",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "0.2s",
                  width: "100%",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                }}
              >
                Beli Sekarang
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
