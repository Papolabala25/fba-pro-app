import { NextResponse } from "next/server"

export async function POST(req: Request) {
  return NextResponse.json({
    data: [
      {
        name: "Product Test Working",
        price: 20,
        roi: 50,
        margin: 30,
        profit: 600,
        sales: 100,
        competition: "LOW",
        verdict: "WINNER",
        insight: "API is now working correctly"
      }
    ]
  })
}