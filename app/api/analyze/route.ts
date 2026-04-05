import { NextResponse } from "next/server"

const API_KEY = process.env.RAINFOREST_API_KEY

function safeNumber(n: any) {
  return typeof n === "number" ? n : 0
}

// =========================
// AMAZON
// =========================
async function fetchAmazon(query: string) {
  const url = `https://api.rainforestapi.com/request?api_key=${API_KEY}&type=search&amazon_domain=amazon.com&search_term=${encodeURIComponent(query)}`

  const res = await fetch(url)
  const data = await res.json()

  return (data?.search_results || []).map((item: any) => ({
    title: item?.title,
    price: safeNumber(item?.price?.value),
    rating: safeNumber(item?.rating),
    reviews: safeNumber(item?.ratings_total),
    link: item?.link,
    image: item?.thumbnail,
    marketplace: "amazon",
  }))
}

// =========================
// MERCADOLIBRE
// =========================
async function fetchML(query: string) {
  const url = `https://api.mercadolibre.com/sites/MLM/search?q=${encodeURIComponent(query)}`

  const res = await fetch(url)
  const data = await res.json()

  return (data?.results || []).map((item: any) => ({
    title: item?.title,
    price: safeNumber(item?.price),
    reviews: safeNumber(item?.sold_quantity),
    link: item?.permalink,
    image: item?.thumbnail,
    marketplace: "mercadolibre",
  }))
}

// =========================
// ARBITRAJE (MEJORADO)
// =========================
function matchProducts(ml: any, amz: any) {
  const words = ml.title.toLowerCase().split(" ")
  let matches = 0

  for (const w of words) {
    if (w.length > 3 && amz.title.toLowerCase().includes(w)) {
      matches++
    }
  }

  return matches >= 2
}

function arbitrage(mlProducts: any[], amazonProducts: any[]) {
  const result: any[] = []

  for (const ml of mlProducts) {
    for (const amz of amazonProducts) {
      if (!ml.price || !amz.price) continue
      if (!matchProducts(ml, amz)) continue

      const fees = amz.price * 0.15
      const profit = amz.price - fees - ml.price
      const roi = (profit / ml.price) * 100

      if (profit > -20) { // permite ver resultados
        result.push({
          title: amz.title,
          buyPrice: ml.price,
          sellPrice: amz.price,
          profit,
          roi,
          decision: roi > 30 ? "🔥 STRONG" : "🟡 NORMAL",
          buyLink: ml.link,
          sellLink: amz.link,
        })
      }
    }
  }

  return result.sort((a, b) => b.profit - a.profit).slice(0, 10)
}

// =========================
// API
// =========================
export async function POST(req: Request) {
  try {
    const { query, marketplace } = await req.json()

    if (!query) {
      return NextResponse.json({ success: false, error: "Missing query" })
    }

    // 🔥 ARBITRAJE
    if (marketplace === "arbitrage") {
      const ml = await fetchML(query)
      const amz = await fetchAmazon(query)

      const opportunities = arbitrage(ml, amz)

      return NextResponse.json({
        success: true,
        type: "arbitrage",
        opportunities,
      })
    }

    // NORMAL
    if (marketplace === "amazon") {
      const products = await fetchAmazon(query)
      return NextResponse.json({ success: true, type: "normal", products })
    }

    if (marketplace === "mercadolibre") {
      const products = await fetchML(query)
      return NextResponse.json({ success: true, type: "normal", products })
    }

    return NextResponse.json({ success: false, error: "Invalid marketplace" })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
}