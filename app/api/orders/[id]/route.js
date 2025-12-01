import db from "@/lib/db"; 

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { status } = body;

  try {
    // Update order
    await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);

    // Update history pembeli
    await db.query(
      "UPDATE history SET status = ? WHERE order_id = ?",
      [status, id]
    );

    return Response.json({ success: true, message: "Order updated" });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
