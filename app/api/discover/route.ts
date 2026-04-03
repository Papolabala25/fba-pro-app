import { NextResponse } from "next/server"

const forbiddenBrands = ["Nike", "Apple", "Samsung", "Sony", "Adidas", "Purina"]

function isGenericProduct(name: string) {
  return !forbiddenBrands.some(brand =>
    name.toLowerCase().includes(brand.toLowerCase())
  )
}

function generateProducts(keyword: string) {
  return [
    {
      name: `${keyword} resistance bands set`,
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
    },
    {
      name: `Nike ${keyword} edition`,
      price: 80,
      cost: 40,
      sales: 500,
      competition: "HIGH",
      isAmazon: false
    },
    {
      name: `${keyword} basic tool`,
      price: 15,
      cost: 6,
      sales: 200,
      competition: "LOW",
      isAmazon: true
    }
  ]
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
        ? "High ROI + low competition. Strong private label potential."
        : "Moderate opportunity. Needs differentiation."
  }
}

export async function POST(req: Request) {
  const { keyword } = await req.json()

  let products = generateProducts(keyword)

  // 🔴 FILTRO PRO
  products = products.filter(p =>
    isGenericProduct(p.name) && !p.isAmazon
  )

  const analyzed = products.map(analyze)

  return NextResponse.json({ data: analyzed })
}