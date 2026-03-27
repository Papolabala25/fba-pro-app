export interface ProductData {
  profitPower: number
  competition: number
  momentum: number
  rankStability: number
}

export function calculateAROGAScore(data: ProductData): number {
  const weights = {
    profitPower: 0.35,
    competition: 0.25,
    momentum: 0.25,
    rankStability: 0.15
  }

  const competitionInverse = 100 - data.competition

  const score =
    data.profitPower * weights.profitPower +
    competitionInverse * weights.competition +
    data.momentum * weights.momentum +
    data.rankStability * weights.rankStability

  return Math.round(score)
}
