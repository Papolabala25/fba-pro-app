"use client"

import { useState } from "react"

export default function Home() {
  const [keyword, setKeyword] = useState("")
  const [market, setMarket] = useState("amazon")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!keyword) return

    setLoading(true)

    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ keyword, market })
      })

      const data = await res.json()
      setProducts(data.data || [])
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  const winners = products.filter(p => p.verdict === "WINNER").length
  const avgROI =
    products.length > 0
      ? Math.round(products.reduce((acc, p) => acc + p.roi, 0) / products.length)
      : 0
  const topROI =
    products.length > 0
      ? Math.max(...products.map(p => p.roi))
      : 0

  return (
    <main style={{ background: "#000", minHeight: "100vh", padding: 30, color: "#fff" }}>

      <h1 style={{ color: "gold", fontSize: 32 }}>
        FBA Intelligence PRO
      </h1>

      <p style={{ color: "#aaa", marginBottom: 20 }}>
        MultiMarket AI Engine (Amazon + MercadoLibre)
      </p>

      {/* INPUT + SELECT */}
      <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter niche..."
          style={{
            padding: 12,
            width: 250,
            borderRadius: 8,
            border: "1px solid #333",
            background: "#111",
            color: "#fff"
          }}
        />

        <select
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 8,
            background: "#111",
            color: "#fff",
            border: "1px solid #333"
          }}
        >
          <option value="amazon">Amazon</option>
          <option value="meli">MercadoLibre</option>
        </select>

        <button
          onClick={handleSearch}
          style={{
            background: "gold",
            color: "#000",
            padding: "12px 20px",
            borderRadius: 8,
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          {loading ? "Analyzing..." : "Analyze Market"}
        </button>

      </div>

      {/* STATS */}
      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <div style={cardStat}>
          <h3>Top ROI</h3>
          <p>{topROI}%</p>
        </div>

        <div style={cardStat}>
          <h3>Winners</h3>
          <p>{winners}</p>
        </div>

        <div style={cardStat}>
          <h3>Avg ROI</h3>
          <p>{avgROI}%</p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {products.map((p, i) => {
          const isWinner = p.verdict === "WINNER"

          return (
            <div key={i} style={{
              ...cardProduct,
              border: isWinner ? "1px solid gold" : "1px solid #222",
              boxShadow: isWinner ? "0 0 12px rgba(255,215,0,0.4)" : "none"
            }}>

              <h3 style={{ fontSize: 14 }}>{p.name}</h3>

              <a
                href={`https://www.${market === "amazon" ? "amazon.com" : "mercadolibre.com.mx"}/s?k=${encodeURIComponent(p.name)}`}
                target="_blank"
                style={{ color: "#4da6ff", fontSize: 12 }}
              >
                🔍 View Product
              </a>

              <p style={{
                color:
                  p.verdict === "WINNER"
                    ? "gold"
                    : p.verdict === "OPPORTUNITY"
                    ? "orange"
                    : "red",
                fontWeight: "bold"
              }}>
                {p.verdict}
              </p>

              <p>💰 ${p.price}</p>
              <p>📊 ROI: {p.roi}%</p>
              <p>📦 Margin: {p.margin}%</p>
              <p>💸 Profit: ${p.profit}</p>
              <p>📈 Sales: {p.sales}/month</p>
              <p>⚔️ {p.competition}</p>

              <p style={{ marginTop: 10, fontSize: 13, color: "#ccc" }}>
                🧠 {p.insight}
              </p>

            </div>
          )
        })}
      </div>

    </main>
  )
}

const cardStat = {
  background: "#111",
  padding: 20,
  borderRadius: 10,
  width: 200,
  textAlign: "center" as const,
  border: "1px solid #222"
}

const cardProduct = {
  background: "#111",
  padding: 20,
  borderRadius: 10,
  width: 260,
  border: "1px solid #222"
}