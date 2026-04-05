import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { keyword, marketplace, country } = await req.json()

  try {
    let url = ""

    // 🟡 AMAZON (Rainforest API)
    if (marketplace === "amazon") {
      url = `https://api.rainforestapi.com/request?api_key=${process.env.RAINFOREST_API_KEY}&type=search&amazon_domain=${country}&search_term=${encodeURIComponent(keyword)}`
    }

    // 🔵 MERCADOLIBRE (API pública real)
    if (marketplace === "mercadolibre") {
      url = `https://api.mercadolibre.com/sites/${country}/search?q=${encodeURIComponent(keyword)}`
    }

    const res = await fetch(url)
    const data = await res.json()

    let products: any[] = []

    // 🟡 PARSE AMAZON
    if (marketplace === "amazon") {
      products = (data.search_results || []).slice(0, 10).map((p: any) => ({
        name: p.title,
        price: p.price?.value || 0,
        sales: Math.floor(Math.random() * 500),
        competition: "MEDIUM"
      }))
    }

    // 🔵 PARSE MERCADOLIBRE
    if (marketplace === "mercadolibre") {
      products = (data.results || []).slice(0, 10).map((p: any) => ({
        name: p.title,
        price: p.price || 0,
        sales: p.sold_quantity || 0,
        competition: "MEDIUM"
      }))
    }

    // 🧠 ANÁLISIS PRO
    const analyzed = products.map(p => {
      const cost = p.price * 0.3
      const roi = Math.round(((p.price - cost) / cost) * 100)
      const margin = Math.round(((p.price - cost) / p.price) * 100)
      const profit = Math.round((p.price - cost) * p.sales)

      let verdict = "REJECT"

      if (roi > 40 && p.sales > 50) {
        verdict = "WINNER"
      } else if (roi > 25) {
        verdict = "OPPORTUNITY"
      }

      return {
        ...p,
        roi,
        margin,
        profit,
        verdict
      }
    })

    return NextResponse.json({ data: analyzed })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 })
  }
}