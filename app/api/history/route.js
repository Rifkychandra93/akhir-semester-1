import db from "@/lib/db";

export async function GET() {
  try {
    const [orders] = await db.query("SELECT * FROM orders ORDER BY id DESC");

    return Response.json({ success: true, data: orders });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
