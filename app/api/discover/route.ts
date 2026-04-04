import { NextResponse } from "next/server"

// 🔥 DEBUG: esto nos confirma en logs que esta versión está corriendo
console.log("🔥 VERSION NUEVA API V2 🔥")

// 🚫 Marcas prohibidas (no queremos competir contra gigantes)
const forbiddenBrands = ["Nike", "Apple", "Samsung", "Sony", "Adidas", "Purina"]

function isGenericProduct(name: string) {
  return !forbiddenBrands.some(brand =>
    name.toLowerCase().includes(brand.toLowerCase())
  )
}

// 🧠 Generador base (simulación inteligente)
function generateProducts(keyword: string) {
  return [
    {
      name: "🚨 CAMBIO REAL VERIFICADO 🚨",
      price: 35,
      cost: 10,
      sales: 250,
      competition: "LOW",
      isAmazon: false
    },
    {
      name: `${keyword} premium bundle kit`,
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

// 📊 Motor de análisis
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

// 🚀 ENDPOINT PRINCIPAL
export async function POST(req: Request) {
  try {
    const { keyword } = await req.json()

    let products = generateProducts(keyword)

    // 🔴 FILTRO PRO (clave de tu negocio)
    products = products.filter(p =>
      isGenericProduct(p.name) && !p.isAmazon
    )

    const analyzed = products.map(analyze)

    return NextResponse.json({ data: analyzed })

  } catch (error) {
    return NextResponse.json({
      error: "API error",
      details: error
    })
  }
}