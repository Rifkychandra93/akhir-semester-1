import db from "@/lib/db";

export async function GET(_, { params }) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [params.id]
    );

    if (rows.length === 0)
      return Response.json({ success: false, message: "Produk tidak ditemukan" });

    return Response.json({ success: true, product: rows[0] });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
