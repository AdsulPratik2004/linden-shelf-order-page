import { connection } from "next/server";
import { product } from "@/lib/products";

export async function GET() {
  await connection();

  const mode = process.env.PRODUCT_API_MODE;

  if (mode === "error") {
    return Response.json({ error: "unavailable" }, { status: 500 });
  }

  if (mode === "slow") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return Response.json(product);
}
