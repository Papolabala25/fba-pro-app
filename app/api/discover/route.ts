import { NextResponse } from "next/server"

const forbiddenBrands = ["Nike", "Apple", "Samsung"]

function isGenericProduct(name: string) {
  return !forbiddenBrands.some(brand =>
    name.toLowerCase().includes(brand.toLowerCase())
  )
}

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
  const { keyword, market } = await req.json()

  let products: any[] = []

  // AMAZON
  if (market === "amazon") {
    products = [
      {
        name: `${keyword} resistance bands`,
        price: 25,
        cost: 8,
        sales: 300,
        competition: "LOW",
        isAmazon: false
      },
      {
        name: `${keyword} premium kit`,
        price: 60,
        cost: 25,
        sales: 120,
        competition: "MEDIUM",
        isAmazon: false
      }
    ]
  }

  // MERCADOLIBRE
  if (market === "meli") {
    products = [
      {
        name: `${keyword} kit profesional`,
        price: 500,
        cost: 200,
        sales: 150,
        competition: "LOW",
        isAmazon: false
      },
      {
        name: `${keyword} versión económica`,
        price: 300,
        cost: 120,
        sales: 220,
        competition: "MEDIUM",
        isAmazon: false
      }
    ]
  }

  products = products.filter(p => isGenericProduct(p.name))

  const analyzed = products.map(analyze)

  return NextResponse.json({ data: analyzed })
}