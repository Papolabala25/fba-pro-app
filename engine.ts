// ======================================================
// TYPES
// ======================================================

type Mode = "conservative" | "balanced" | "aggressive";

export interface Product {
  name: string;
  margin: number;
  demand: number;
  competition: number;
  stability: number;
  volatility: number;
}

export interface RiskAnalysis {
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
}

export interface ProductAnalysis extends Product {
  score: number;
  classification: string;
  risk: RiskAnalysis;
  decision: string;
}

// ======================================================
// UTILS
// ======================================================

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function randomVariation(value: number, variance = 10): number {
  const variation = (Math.random() * variance * 2) - variance;
  return clamp(value + variation);
}

function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ======================================================
// SCORING ENGINE
// ======================================================

function getWeights(mode: Mode) {
  switch (mode) {
    case "conservative":
      return { margin: 0.2, demand: 0.2, competition: 0.1, stability: 0.3, volatility: 0.2 };
    case "aggressive":
      return { margin: 0.35, demand: 0.3, competition: 0.1, stability: 0.1, volatility: 0.15 };
    default:
      return { margin: 0.3, demand: 0.25, competition: 0.15, stability: 0.2, volatility: 0.1 };
  }
}

function calculateRisk(product: Product): RiskAnalysis {

  const riskScore =
    (product.volatility * 0.4) +
    ((100 - product.stability) * 0.3) +
    (product.competition * 0.3);

  let riskLevel: "Low" | "Medium" | "High" = "Low";

  if (riskScore > 70) riskLevel = "High";
  else if (riskScore > 40) riskLevel = "Medium";

  return {
    riskScore: parseFloat(riskScore.toFixed(2)),
    riskLevel
  };
}

function classifyScore(score: number): string {

  if (score >= 80) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 60) return "Moderate";
  return "Weak";

}

// ======================================================
// MAIN ANALYSIS
// ======================================================

export function calculateDetailedScore(product: Product, mode: Mode): ProductAnalysis {

  const w = getWeights(mode);

  const score =
    (product.margin * w.margin) +
    (product.demand * w.demand) +
    ((100 - product.competition) * w.competition) +
    (product.stability * w.stability) +
    ((100 - product.volatility) * w.volatility);

  const finalScore = parseFloat(score.toFixed(2));

  // 🔥 DECISION ENGINE
  let decision = "AVOID";

  if (finalScore >= 75 && product.competition < 60) {
    decision = "STRONG BUY";
  } else if (finalScore >= 65) {
    decision = "BUY";
  } else if (finalScore >= 55) {
    decision = "HOLD";
  }

  return {
    ...product,
    score: finalScore,
    classification: classifyScore(finalScore),
    risk: calculateRisk(product),
    decision
  };
}

// ======================================================
// PORTFOLIO ANALYSIS
// ======================================================

export function analyzePortfolio(products: Product[], mode: Mode): ProductAnalysis[] {
  return products.map(p => calculateDetailedScore(p, mode));
}

// ======================================================
// MONTE CARLO SIMULATION
// ======================================================

export function monteCarloSimulation(product: Product, iterations = 1000) {

  const results: number[] = [];

  for (let i = 0; i < iterations; i++) {

    const simulated: Product = {
      ...product,
      margin: randomVariation(product.margin, 8),
      demand: randomVariation(product.demand, 12),
      competition: randomVariation(product.competition, 10),
      stability: randomVariation(product.stability, 8),
      volatility: randomVariation(product.volatility, 10)
    };

    const score = calculateDetailedScore(simulated, "balanced").score;

    results.push(score);
  }

  const avg = mean(results);
  const best = Math.max(...results);
  const worst = Math.min(...results);

  return {
    averageScore: avg.toFixed(2),
    bestCase: best.toFixed(2),
    worstCase: worst.toFixed(2)
  };
}

// ======================================================
// PORTFOLIO OPTIMIZER
// ======================================================

export function optimizePortfolio(products: ProductAnalysis[], capital: number) {

  const totalScore =
    products.reduce((sum, p) => sum + p.score, 0);

  return products.map(p => {

    const weight = p.score / totalScore;

    return {
      name: p.name,
      weight: (weight * 100).toFixed(2) + "%",
      capitalAllocated: Math.round(weight * capital)
    };

  });
}

export function calculateFinancials(product: ProductAnalysis) {

  // Precio estimado basado en demanda
  const price = Math.round(10 + (product.demand * 0.8))

  // Costo basado en competencia + margen
  const cost = Math.round(price * (0.4 + (product.competition / 200)))

  const profit = price - cost

  const roi = ((profit / cost) * 100)

  return {
    price,
    cost,
    profit,
    roi: roi.toFixed(2)
  }
}