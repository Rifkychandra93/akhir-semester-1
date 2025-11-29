import db from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    // Validasi data
    if (!body.nama || !body.metode || !body.total || !body.cart) {
      return Response.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    await db.query(
      `INSERT INTO orders 
      (booking, nama, metode, total, expiredAt, tanggal, cart) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        body.booking,
        body.nama,
        body.metode,
        body.total,
        body.expiredAt,
        body.tanggal,
        JSON.stringify(body.cart),
      ]
    );

    return Response.json({ success: true });
  } catch (err) {
    console.log(err);
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
