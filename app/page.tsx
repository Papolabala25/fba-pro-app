"use client"

import { useState } from "react"

export default function Home() {
  const [keyword, setKeyword] = useState("")
  const [market, setMarket] = useState("meli")
  const [country, setCountry] = useState("mx")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!keyword) return
    setLoading(true)

    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, market, country })
      })

      const data = await res.json()
      setProducts(data.data || [])
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  const winners = products.filter(p => p.score >= 80).length

  return (
    <main style={mainStyle}>

      {/* HEADER */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={titleStyle}>FBA Intelligence PRO</h1>
        <p style={subtitleStyle}>
          MultiMarket Intelligence Engine • Real Data • Decision System
        </p>
      </div>

      {/* CONTROLES */}
      <div style={controlsStyle}>

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search product opportunity..."
          style={inputStyle}
        />

        <select value={market} onChange={(e) => setMarket(e.target.value)} style={selectStyle}>
          <option value="meli">MercadoLibre</option>
          <option value="amazon">Amazon</option>
        </select>

        <select value={country} onChange={(e) => setCountry(e.target.value)} style={selectStyle}>
          <option value="mx">México</option>
          <option value="co">Colombia</option>
          <option value="ar">Argentina</option>
          <option value="cl">Chile</option>
        </select>

        <button onClick={handleSearch} style={buttonStyle}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>

      </div>

      {/* STATS */}
      <div style={statsContainer}>
        <Stat title="Products" value={products.length} />
        <Stat title="High Score" value={winners} />
        <Stat title="Top Score" value={products[0]?.score || 0} />
      </div>

      {/* RESULTADOS */}
      <div style={gridStyle}>
        {products.map((p, i) => (
          <div
            key={i}
            style={{
              ...cardStyle,
              border: p.score >= 80 ? "1px solid gold" : "1px solid #222"
            }}
          >

            <h3 style={{ fontSize: 14 }}>{p.name}</h3>

            <a href={p.link} target="_blank" style={linkStyle}>
              🔍 View Product
            </a>

            {/* SCORE (DIFERENCIADOR CLAVE) */}
            <div style={scoreBox(p.score)}>
              SCORE {p.score}/100
            </div>

            <p>💰 {p.currency} {p.price}</p>
            <p>📈 Sales: {p.sales}</p>

            <p>💸 Profit Est: {p.currency} {p.profit}</p>
            <p>📊 ROI: {p.roi}%</p>

            <p style={insightStyle}>
              🧠 {p.insight}
            </p>

          </div>
        ))}
      </div>

    </main>
  )
}

/* COMPONENTE */
function Stat({ title, value }: any) {
  return (
    <div style={statCard}>
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  )
}

/* ESTILOS */
const mainStyle = {
  background: "#0a0a0a",
  minHeight: "100vh",
  padding: 30,
  color: "#fff",
  fontFamily: "Arial"
}

const titleStyle = { fontSize: 34, color: "gold" }
const subtitleStyle = { color: "#aaa" }

const controlsStyle = {
  display: "flex",
  gap: 10,
  marginBottom: 30
}

const inputStyle = {
  padding: 12,
  width: 260,
  borderRadius: 8,
  background: "#111",
  color: "#fff",
  border: "1px solid #333"
}

const selectStyle = {
  padding: 12,
  borderRadius: 8,
  background: "#111",
  color: "#fff",
  border: "1px solid #333"
}

const buttonStyle = {
  background: "gold",
  color: "#000",
  padding: "12px 20px",
  borderRadius: 8,
  fontWeight: "bold",
  cursor: "pointer"
}

const statsContainer = {
  display: "flex",
  gap: 20,
  marginBottom: 30
}

const statCard = {
  background: "#111",
  padding: 15,
  borderRadius: 10,
  border: "1px solid #222"
}

const gridStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: 20
}

const cardStyle = {
  width: 260,
  padding: 20,
  borderRadius: 12,
  background: "#111"
}

const linkStyle = {
  color: "#4da6ff",
  fontSize: 12
}

const insightStyle = {
  fontSize: 12,
  color: "#ccc"
}

const scoreBox = (score: number) => ({
  marginTop: 10,
  marginBottom: 10,
  padding: 8,
  borderRadius: 6,
  background:
    score > 80 ? "gold" :
    score > 60 ? "orange" : "#333",
  color: "#000",
  fontWeight: "bold",
  textAlign: "center" as const
})