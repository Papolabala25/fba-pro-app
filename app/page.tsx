"use client"

import { useState } from "react"

export default function Home() {
  const [keyword, setKeyword] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    console.log("1. Click detectado")

    if (!keyword) {
      console.log("2. No keyword")
      return
    }

    console.log("3. Keyword:", keyword)

    setLoading(true)

    try {
      console.log("4. Antes de fetch")

      const res = await fetch("/api/discover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ keyword })
      })

      console.log("5. Fetch ejecutado", res)

      const data = await res.json()

      console.log("6. Data recibida", data)

      setProducts(data.data || [])
    } catch (error) {
      console.error("ERROR:", error)
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
      
      {/* HEADER */}
      <h1 style={{ color: "gold", fontSize: 32, marginBottom: 10 }}>
        FBA Intelligence PRO
      </h1>

      <p style={{ color: "#aaa", marginBottom: 20 }}>
        Market Intelligence Engine for Amazon FBA
      </p>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter niche..."
          style={{
            padding: 12,
            width: 300,
            borderRadius: 8,
            border: "1px solid #333",
            background: "#111",
            color: "#fff"
          }}
        />

        <button
          onClick={() => {
            alert("CLICK OK")
            handleSearch()
          }}
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

      {/* DEBUG */}
      <p style={{ marginBottom: 20 }}>
        Productos encontrados: {products.length}
      </p>

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
                href={`https://www.amazon.com/s?k=${encodeURIComponent(p.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#4da6ff",
                  fontSize: 12,
                  display: "block",
                  marginBottom: 8
                }}
              >
                🔍 View on Amazon
              </a>

              <p style={{
                color:
                  p.verdict === "WINNER"
                    ? "gold"
                    : p.verdict === "OPPORTUNITY"
                    ? "orange"
                    : "red",
                fontWeight: "bold",
                fontSize: 16
              }}>
                {p.verdict}
              </p>

              <p>💰 ${p.price}</p>
              <p>📊 ROI: {p.roi}%</p>
              <p>📦 Margin: {p.margin}%</p>
              <p>💸 Profit: ${p.profit}</p>
              <p>📈 Sales: {p.sales}/month</p>
              <p>⚔️ {p.competition}</p>

              <p style={{
                marginTop: 12,
                fontSize: 13,
                color: "#ccc",
                lineHeight: "1.4"
              }}>
                🧠 {p.insight}
              </p>

              <button style={saveButton}>
                Save
              </button>

            </div>
          )
        })}
      </div>

    </main>
  )
}

/* STYLES */

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

const saveButton = {
  marginTop: 10,
  background: "gold",
  color: "#000",
  padding: "8px 12px",
  borderRadius: 6,
  cursor: "pointer",
  border: "none"
}