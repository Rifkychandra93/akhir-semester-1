import db from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    // INSERT INTO ORDERS
    const orderSql = `
      INSERT INTO orders 
      (booking_code, nama_pemesan, metode, total, status, expired_at, tanggal)
      VALUES (?, ?, ?, ?, 'Belum Dibayar', ?, ?)
    `;

    const orderValues = [
      body.booking, 
      body.nama,
      body.metode,
      body.total,
      body.expiredAt,
      body.tanggal
    ];

    const [orderResult] = await db.query(orderSql, orderValues);
    const orderId = orderResult.insertId; // ID order

    // INSERT ITEMS
    const itemSql = `
      INSERT INTO order_items (order_id, product_name, qty, price, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `;

    for (const item of body.cart) {
      await db.query(itemSql, [
        orderId,
        item.name,
        item.qty,
        item.price,
        item.price * item.qty,
      ]);
    }

    return Response.json({ success: true });

  } catch (err) {
    console.error("DB ERROR =>", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
