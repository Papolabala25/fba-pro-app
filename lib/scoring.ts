export function enhancedScore(product: any) {
  let score = 0;
  let label = "⚔️ MEDIUM";
  let insight = "";

  const strongBrands = ["Purina", "Nestlé", "Nike", "Adidas", "Apple"];

  const isAmazon =
    product.title.includes("Amazon Basics") ||
    product.brand?.includes("Amazon") ||
    product.seller === "Amazon";

  const isStrongBrand = strongBrands.some((b) =>
    product.brand?.includes(b)
  );

  // ❌ DESCARTAR AUTOMÁTICO
  if (isAmazon) {
    return {
      label: "❌ AVOID",
      insight: "Sold or dominated by Amazon. Not viable for private label."
    };
  }

  if (isStrongBrand) {
    return {
      label: "⚠️ TEST",
      insight:
        "Strong brand dominance. Requires heavy differentiation and branding."
    };
  }

  // 🟢 SCORING NORMAL
  if (product.roi > 35) score += 3;
  else if (product.roi > 25) score += 2;
  else score += 1;

  if (product.margin > 25) score += 3;
  else if (product.margin > 15) score += 2;

  if (product.sales > 150) score += 3;
  else if (product.sales > 80) score += 2;

  if (product.profit > 1000) score += 3;
  else if (product.profit > 500) score += 2;

  // 🟢 CLASIFICACIÓN FINAL
  if (score >= 9) {
    label = "🟢 WINNER";
    insight = "High potential product with strong margins and scalability.";
  } else if (score >= 6) {
    label = "⚔️ MEDIUM";
    insight = "Decent opportunity. Needs optimization and differentiation.";
  } else {
    label = "🔴 LOW";
    insight = "Low profitability or high risk.";
  }

  return { label, insight };
}