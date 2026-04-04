import { NextResponse } from "next/server"

const MELI_SITES: any = {
  mx: "MLM",
  co: "MCO",
  ar: "MLA",
  cl: "MLC"
}

function analyze(p: any) {
  const cost = p.price * 0.4
  const roi = Math.round(((p.price - cost) / cost) * 100)
  const profit = Math.round((p.price - cost) * (p.sales || 50))

  // 🔥 SCORE PRO (tu ventaja competitiva)
  let score = 0

  if (roi > 50) score += 40
  else if (roi > 30) score += 25

  if (p.sales > 200) score += 30
  else if (p.sales > 50) score += 15

  if (p.price > 20 && p.price < 80) score += 20

  if (score > 100) score = 100

  return {
    ...p,
    roi,
    profit,
    score,
    insight:
      score > 80
        ? "High demand + strong margins. Ideal opportunity."
        : score > 60
        ? "Good potential. Needs differentiation."
        : "Low priority product."
  }
}

export async function POST(req: Request) {
  try {
    const { keyword, market, country } = await req.json()

    // 🔥 MERCADOLIBRE REAL
    if (market === "meli") {
      const site = MELI_SITES[country] || "MLM"

      const res = await fetch(
        `https://api.mercadolibre.com/sites/${site}/search?q=${keyword}`
      )

      const data = await res.json()

      const products = data.results.slice(0, 12).map((item: any) => ({
        name: item.title,
        price: item.price,
        currency: item.currency_id,
        sales: item.sold_quantity || 0,
        link: item.permalink
      }))

      const analyzed = products.map(analyze)
        .sort((a: any, b: any) => b.score - a.score)

      return NextResponse.json({ data: analyzed })
    }

    // ⚠️ AMAZON (placeholder listo para API real)
    return NextResponse.json({ data: [] })

  } catch (error) {
    return NextResponse.json({ data: [] })
  }
}