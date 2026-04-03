import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log("API RECIBIÓ:", body)

    return NextResponse.json({
      data: [
        {
          name: "Test Product PRO",
          price: 25,
          roi: 45,
          margin: 30,
          profit: 500,
          sales: 120,
          competition: "LOW",
          verdict: "WINNER",
          insight: "This is a test product from API"
        }
      ]
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json({
      error: "API error"
    }, { status: 500 })
  }
}