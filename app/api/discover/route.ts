import { NextResponse } from "next/server"

// 🔥 ventas estimadas
function estimateSales(reviews: number, rating: number, price: number) {
  let sales = reviews * 0.7

  if (rating >= 4.5) sales *= 1.4
  if (rating < 4) sales *= 0.6

  if (price < 20) sales *= 1.2
  if (price > 50) sales *= 0.85

  return Math.max(30, Math.round(sales))
}

// 🔥 costos FBA
function calculateFBA(price: number) {
  const referral = price * 0.15

  let fbaFee = 5
  if (price > 30) fbaFee = 6.5
  if (price > 60) fbaFee = 8

  const ads = price * 0.12

  return { referral, fbaFee, ads }
}

// 🔥 negocio
function calculateBusiness(price: number, sales: number) {
  const productCost = price * 0.27
  const { referral, fbaFee, ads } = calculateFBA(price)

  const totalCost = productCost + referral + fbaFee + ads

  const profitPerUnit = price - totalCost
  const monthlyProfit = profitPerUnit * sales
  const roi = (profitPerUnit / totalCost) * 100
  const margin = (profitPerUnit / price) * 100

  return {
    profit: Math.round(monthlyProfit),
    roi: Math.round(roi),
    margin: Math.round(margin)
  }
}

// 🔥 competencia calibrada
function competitionLevel(reviews: number, sales: number) {
  if (reviews > 2000 || sales > 400) return "VERY HIGH"
  if (reviews > 800 || sales > 200) return "HIGH"
  if (reviews > 300 || sales > 100) return "MEDIUM"
  return "LOW"
}

// 🔥 score PRO
function calculateScore(roi: number, sales: number, competition: string) {
  let score = 0

  score += roi * 2
  score += sales * 0.4

  if (roi > 35 && sales > 150) score += 30
  if (roi > 25 && sales > 100) score += 15

  if (competition === "LOW") score += 25
  if (competition === "MEDIUM") score += 10
  if (competition === "HIGH") score -= 10
  if (competition === "VERY HIGH") score -= 25

  return Math.round(score)
}

// 🔥 veredicto
function verdict(score: number) {
  if (score >= 110) return "WINNER"
  if (score >= 70) return "OPPORTUNITY"
  return "AVOID"
}

// 🧠 IA PRO (MEJORA REAL)
function generateAIInsight(p: any) {
  let insight = ""

  if (p.verdict === "WINNER") {
    insight = `High ROI (${p.roi}%) with ${p.competition.toLowerCase()} competition. Strong profit potential of $${p.profit}/month.`
  }

  if (p.verdict === "OPPORTUNITY") {
    insight = `Moderate ROI (${p.roi}%) with ${p.competition.toLowerCase()} competition. Requires differentiation to improve margins.`
  }

  if (p.verdict === "AVOID") {
    insight = `Low profitability (${p.roi}% ROI) and high risk. Market conditions are not favorable for entry.`
  }

  // 🔥 enriquecimiento inteligente
  if (p.price > 50) {
    insight += " Premium pricing allows higher margins."
  }

  if (p.sales > 100) {
    insight += " Demand is validated with solid sales volume."
  }

  if (p.competition === "HIGH" || p.competition === "VERY HIGH") {
    insight += " Competition is a significant barrier."
  }

  return insight
}

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json()
    const apiKey = process.env.RAINFOREST_API_KEY

    const url = `https://api.rainforestapi.com/request?api_key=${apiKey}&type=search&amazon_domain=amazon.com&search_term=${keyword}`

    const res = await fetch(url)
    const data = await res.json()

    const products = data.search_results?.slice(0, 6) || []

    const final = products.map((p: any) => {
      const price = p.price?.value || 25
      const reviews = p.rating_count || 100
      const rating = p.rating || 4

      const sales = estimateSales(reviews, rating, price)
      const business = calculateBusiness(price, sales)
      const competition = competitionLevel(reviews, sales)
      const score = calculateScore(business.roi, sales, competition)
      const result = verdict(score)

      const product = {
        name: p.title,
        price,
        roi: business.roi,
        profit: business.profit,
        margin: business.margin,
        sales,
        competition,
        score,
        verdict: result
      }

      return {
        ...product,
        insight: generateAIInsight(product)
      }
    })

    return NextResponse.json({
      success: true,
      data: final
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { success: false },
      { status: 500 }
    )
  }
}