"use client"

import { useState } from "react"

export default function Home() {
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState("amazon")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const search = async () => {
    if (!query) {
      alert("Escribe un producto")
      return
    }

    setLoading(true)
    setData(null)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          marketplace: mode,
        }),
      })

      // 🔥 DEBUG CRÍTICO
      if (!res.ok) {
        const text = await res.text()
        console.error("❌ ERROR HTTP:", res.status, text)
        alert("Error HTTP: " + res.status)
        return
      }

      const json = await res.json()

      console.log("🔥 RESPONSE:", json)

      // 🔥 DEBUG VISUAL EN PRODUCCIÓN
      if (!json.success) {
        alert("Error API: " + json.error)
      }

      setData(json)
    } catch (err: any) {
      console.error("❌ FETCH ERROR:", err)
      alert("Error de conexión: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🚀 Product Intelligence SaaS</h1>

      {/* INPUT */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar producto..."
        style={{ padding: 8, width: 250 }}
      />

      {/* SELECT */}
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        style={{ marginLeft: 10, padding: 8 }}
      >
        <option value="amazon">Amazon</option>
        <option value="mercadolibre">MercadoLibre</option>
        <option value="arbitrage">🔥 Arbitrage</option>
      </select>

      {/* BUTTON */}
      <button
        onClick={search}
        style={{ marginLeft: 10, padding: 8 }}
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>

      {/* DEBUG RAW */}
      <h2>🧪 Debug (Respuesta cruda)</h2>
      <pre
        style={{
          background: "#000",
          color: "#0f0",
          padding: 10,
          fontSize: 12,
          overflow: "auto",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>

      {/* ARBITRAJE */}
      {data?.type === "arbitrage" && (
        <>
          <h2>🔥 Oportunidades de Arbitrage</h2>

          {data.opportunities?.length === 0 && (
            <p>No se encontraron oportunidades</p>
          )}

          {data.opportunities?.map((o: any, i: number) => (
            <div
              key={i}
              style={{
                border: "2px solid gold",
                margin: 10,
                padding: 10,
              }}
            >
              <h3>{o.title}</h3>

              <p>Compra (ML): ${o.buyPrice}</p>
              <p>Venta (Amazon): ${o.sellPrice}</p>

              <p>Profit: ${o.profit.toFixed(2)}</p>
              <p>ROI: {o.roi.toFixed(2)}%</p>

              <p>{o.decision}</p>

              <a href={o.buyLink} target="_blank">
                Comprar
              </a>{" "}
              |{" "}
              <a href={o.sellLink} target="_blank">
                Vender
              </a>
            </div>
          ))}
        </>
      )}

      {/* NORMAL */}
      {data?.type === "normal" && (
        <>
          <h2>📦 Productos</h2>

          {data.products?.length === 0 && (
            <p>No se encontraron productos</p>
          )}

          {data.products?.map((p: any, i: number) => (
            <div
              key={i}
              style={{
                border: "1px solid #ccc",
                margin: 10,
                padding: 10,
              }}
            >
              <img src={p.image} width={80} />

              <h3>{p.title}</h3>

              <p>Precio: ${p.price}</p>
              <p>Marketplace: {p.marketplace}</p>

              <a href={p.link} target="_blank">
                Ver producto
              </a>
            </div>
          ))}
        </>
      )}
    </main>
  )
}