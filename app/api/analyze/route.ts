import { NextResponse } from "next/server"
import { analyzePortfolio } from "@/engine"

export async function POST(req: Request) {

  const products = await req.json()

  const results = analyzePortfolio(products, "balanced")

  return NextResponse.json(results)

}