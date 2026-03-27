"use client"

import { useState } from "react"

export default function Home() {

  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const discover = async () => {

    if (!keyword) return

    setLoading(true)

    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        body: JSON.stringify({ keyword }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await res.json()
      setResults(data)

    } catch (error) {
      console.error("Error:", error)
    }

    setLoading(false)
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "white",
      fontFamily: "Arial",
      padding: 40
    }}>

      {/* HEADER */}
      <div style={{ marginBottom: 40 }}>

        <h1 style={{
          fontSize: 36,
          fontWeight: "bold",
          color: "#d4af37"
        }}>
          FBA Intelligence PRO
        </h1>

        <p style={{ color: "#aaa" }}>
          The Balance of Data and Profit
        </p>

      </div>

      {/* INPUT */}
      <div>

        <input
          placeholder="Enter keyword (fitness, pets, kitchen...)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            padding: 12,
            width: "60%",
            borderRadius: 8,
            border: "1px solid #333",
            background: "#111",
            color: "white",
            marginRight: 10
          }}
        />

        <button
          onClick={discover}
          style={{
            padding: "12px 20px",
            borderRadius: 8,
            background: "#d4af37",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Analyze Market
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <p style={{ marginTop: 20, color: "#d4af37" }}>
          Analyzing market trends...
        </p>
      )}

      {/* RESULTS */}
      <div style={{ marginTop: 40 }}>

        {results.map((p, i) => (
          <div
            key={i}
            style={{
              background: "#111",
              padding: 20,
              borderRadius: 12,
              marginBottom: 20,
              border: "1px solid #222"
            }}
          >

            <h2 style={{ color: "#d4af37" }}>{p.name}</h2>

            <p><strong>Score:</strong> {p.score}</p>
            <p><strong>Class:</strong> {p.classification}</p>
            <p><strong>Risk:</strong> {p.risk.riskLevel}</p>

            <p style={{
              fontWeight: "bold",
              fontSize: 16,
              color:
                p.decision === "STRONG BUY" ? "#00ff99" :
                p.decision === "BUY" ? "#66ff66" :
                p.decision === "HOLD" ? "#ffaa00" :
                "#ff4444"
            }}>
              {p.decision}
            </p>

            <hr style={{ margin: "10px 0", borderColor: "#222" }} />

            <p>💰 <strong>Investment:</strong> ${p.investment.capitalAllocated}</p>
            <p>📊 <strong>Weight:</strong> {p.investment.weight}</p>

            <hr style={{ margin: "10px 0", borderColor: "#222" }} />

            <p>💵 <strong>Price:</strong> ${p.financials.price}</p>
            <p>📦 <strong>Cost:</strong> ${p.financials.cost}</p>
            <p>📈 <strong>Profit:</strong> ${p.financials.profit}</p>
            <p>🚀 <strong>ROI:</strong> {p.financials.roi}%</p>

          </div>
        ))}

      </div>

    </main>
  )
}