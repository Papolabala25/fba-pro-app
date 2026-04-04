import { NextResponse } from "next/server"

function analyze(p: any) {
  const roi = Math.round(((p.price - p.cost) / p.cost) * 100)
  const margin = Math.round(((p.price - p.cost) / p.price) * 100)
  const profit = Math.round((p.price - p.cost) * p.sales)

  let verdict = "REJECT"

  if (roi > 40 && p.sales > 100 && p.competition === "LOW") {
    verdict = "WINNER"
  } else if (roi > 25) {
    verdict = "OPPORTUNITY"
  }

  return {
    ...p,
    roi,
    margin,
    profit,
    verdict,
    insight:
      verdict === "WINNER"
        ? "High ROI + low competition. Strong opportunity."
        : "Moderate opportunity. Needs differentiation."
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const keyword = body.keyword || "test"
    const market = body.market || "amazon"

    let products: any[] = []

    // 🔵 AMAZON (SIEMPRE FUNCIONA)
    if (market === "amazon") {
      products = [
        {
          name: `${keyword} test product`,
          price: 30,
          cost: 10,
          sales: 200,
          competition: "LOW"
        },
        {
          name: `${keyword} premium kit`,
          price: 60,
          cost: 25,
          sales: 120,
          competition: "MEDIUM"
        }
      ]
    }

    // 🟡 MERCADOLIBRE (RESPUESTA SIMPLE)
    if (market === "meli") {
      products = [
        {
          name: `${keyword} kit profesional`,
          price: 500,
          cost: 200,
          sales: 150,
          competition: "LOW"
        },
        {
          name: `${keyword} versión económica`,
          price: 300,
          cost: 120,
          sales: 220,
          competition: "MEDIUM"
        }
      ]
    }

    const analyzed = products.map(analyze)

    return NextResponse.json({ data: analyzed })

  } catch (error) {
    console.log("ERROR API:", error)

    return NextResponse.json({
      data: [
        {
          name: "ERROR FALLBACK PRODUCT",
          price: 20,
          cost: 5,
          sales: 100,
          competition: "LOW",
          roi: 300,
          margin: 75,
          profit: 1500,
          verdict: "WINNER",
          insight: "Fallback funcionando"
        }
      ]
    })
  }
}