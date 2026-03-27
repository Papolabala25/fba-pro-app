export function calculateArogaScore({
  price,
  estimatedMonthlySales,
  productCost,
  fbaFee,
  competitionLevel,
}: {
  price: number
  estimatedMonthlySales: number
  productCost: number
  fbaFee: number
  competitionLevel: number
}) {

  const profitPerUnit = price - productCost - fbaFee
  const monthlyProfit = profitPerUnit * estimatedMonthlySales
  const roi = (profitPerUnit / productCost) * 100
  const capitalRequired = productCost * estimatedMonthlySales

  // --- RISK ENGINE ---
  const marginSafety = profitPerUnit / price
  const competitionRisk = competitionLevel / 10
  const fragilityScore = (competitionRisk * 0.6) + ((1 - marginSafety) * 0.4)

  // --- STRATEGIC SCORE ---
  let strategicScore =
    (roi * 0.4) +
    (marginSafety * 100 * 0.3) +
    ((1 - competitionRisk) * 100 * 0.3)

  strategicScore = Math.max(0, Math.min(100, strategicScore))

  // --- DECISION ENGINE ---
  let verdict = ""

  if (strategicScore < 40) verdict = "REJECT"
  else if (strategicScore < 60) verdict = "CAUTION"
  else if (strategicScore < 80) verdict = "VIABLE"
  else verdict = "SCALE AGGRESSIVELY"

  return {
    profitPerUnit: profitPerUnit.toFixed(2),
    monthlyProfit: monthlyProfit.toFixed(0),
    roi: roi.toFixed(0),
    capitalRequired: capitalRequired.toFixed(0),
    marginSafety: (marginSafety * 100).toFixed(0),
    fragilityScore: fragilityScore.toFixed(2),
    arogaScore: strategicScore.toFixed(0),
    verdict,
  }
}