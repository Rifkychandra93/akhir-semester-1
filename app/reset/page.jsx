"use client";
import { useEffect } from "react";

export default function ResetPage() {
  useEffect(() => {
    localStorage.clear();
    alert("LocalStorage berhasil direset!");
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">LocalStorage sudah direset</h1>
      <p>Silakan kembali ke halaman utama.</p>
    </div>
  );
}
