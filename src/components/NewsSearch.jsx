import { useState, useRef } from 'react'

const CATEGORIES = [
  { id: 'petroleo', label: '🛢️ Petróleo & Gas', query: 'Vaca Muerta petróleo gas YPF Neuquén últimas noticias' },
  { id: 'inmobiliario', label: '🏗️ Inmobiliario', query: 'desarrollo inmobiliario Neuquén Cipolletti Añelo construcción loteos' },
  { id: 'economia', label: '📈 Economía', query: 'economía Alto Valle Neuquén Rincón de los Sauces inversión regional' },
  { id: 'cipolletti', label: '🏙️ Cipolletti', query: 'Cipolletti noticias economía desarrollo urbano Río Negro' },
  { id: 'anelo', label: '⛽ Añelo', query: 'Añelo Neuquén shale petróleo desarrollo ciudad' },
  { id: 'rincon', label: '🔩 Rincón de los Sauces', query: 'Rincón de los Sauces petróleo noticias economía' },
]

const TOPICS = [
  'YPF', 'Shale', 'Fracking', 'Inversión', 'Vivienda', 'Loteos',
  'Empleo', 'Exportaciones', 'Gas', 'Oleoducto', 'Royalties', 'Regalías',
  'TotalEnergies', 'Tecpetrol', 'Shell', 'Pan American Energy',
]

const SYSTEM_PROMPT = `Eres un asistente especializado en noticias y análisis económico-regional de Vaca Muerta y el Alto Valle patagónico (Neuquén, Río Negro, Argentina).

Buscá y analizá noticias recientes sobre:
- Desarrollo petrolero y gasífero en Vaca Muerta (YPF, Tecpetrol, Shell, TotalEnergies, PAE, etc.)
- Mercado inmobiliario en Cipolletti, Neuquén capital, Añelo, Rincón de los Sauces
- Economía regional del Alto Valle: comercio, empleo, exportaciones, inversiones
- Royalties, regalías y finanzas provinciales de Neuquén y Río Negro
- Infraestructura: gasoductos, oleoductos, rutas, servicios
- Impacto económico del petróleo en comunidades locales

Respondé ÚNICAMENTE con un objeto JSON válido. Sin texto adicional, sin markdown, sin backticks.

Formato exacto:
{
  "resumen": "Síntesis ejecutiva de 2-3 líneas en español",
  "noticias": [
    {
      "titulo": "Título de la noticia",
      "descripcion": "Descripción clara de 2-3 oraciones con datos concretos",
      "categoria": "petroleo|inmobiliario|economia|local",
      "fuente": "Nombre del medio",
      "impacto": "alto|medio|bajo",
      "emoji": "emoji relevante"
    }
  ],
  "tendencia": "Análisis de tendencia económica regional en 2-3 oraciones",
  "dato_clave": "Un número, cifra o dato destacado de las noticias"
}`

const impactColor = (impact) => ({ alto: '#ff4d00', medio: '#f0a500', bajo: '#4caf50' }[impact] || '#888')
const catIcon = (cat) => ({ petroleo: '🛢️', inmobiliario: '🏗️', economia: '📈', local: '📍' }[cat] || '📰')

export default function NewsSearch({ apiKey, onClearKey }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const inputRef = useRef(null)

  const search = async (searchQuery) => {
    if (!searchQuery.trim()) return
    setLoading(true)
    setError(null)
    setResults(null)
    setShowSettings(false)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          messages: [{
            role: 'user',
            content: `Buscá noticias recientes (últimas semanas) sobre: "${searchQuery}". Incluí especialmente Vaca Muerta, Neuquén, Cipolletti, Añelo y Rincón de los Sauces. Devolvé SOLO el JSON sin ningún texto adicional.`
          }]
        })
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error?.message || `Error ${response.status}`)
      }

      const data = await response.json()
      const text = data.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('')

      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setResults(parsed)
    } catch (err) {
      if (err.message?.includes('401')) {
        setError('API key inválida. Verificá tu clave en Configuración.')
      } else if (err.message?.includes('429')) {
        setError('Demasiadas búsquedas. Esperá un momento e intentá de nuevo.')
      } else {
        setError(`Error: ${err.message || 'No se pudo completar la búsqueda.'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => { if (query.trim()) search(query) }

  const handleCategory = (cat) => {
    setActiveCategory(cat.id)
    setQuery(cat.label.replace(/^[^\s]+ /, ''))
    search(cat.query)
  }

  const handleTopic = (topic) => {
    const q = `${topic} Vaca Muerta Neuquén`
    setQuery(q)
    search(q)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e8e0d0', paddingBottom: '32px' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)',
        borderBottom: '2px solid #ff4d00',
        padding: '14px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '24px' }} className="derrick">🛢️</div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#fff', lineHeight: 1 }}>
                Vaca Muerta<span style={{ color: '#ff4d00' }}> News</span>
              </div>
              <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Alto Valle · Patagonia
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{ background: 'none', border: 'none', color: '#555', fontSize: '20px', cursor: 'pointer', padding: '4px' }}
          >
            ⚙️
          </button>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
              🔑 API Key guardada: <span style={{ color: '#4caf50' }}>••••••••{apiKey.slice(-6)}</span>
            </div>
            <button
              onClick={onClearKey}
              style={{
                background: '#2a0a0a', border: '1px solid #ff4d00', borderRadius: '6px',
                padding: '8px 14px', color: '#ff4d00', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              Cambiar API Key
            </button>
          </div>
        )}

        {/* Search bar */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Buscar: petróleo, vivienda, economía..."
            style={{
              flex: 1,
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '11px 14px',
              color: '#e8e0d0',
              fontSize: '15px',
              outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = '#ff4d00'}
            onBlur={e => e.target.style.borderColor = '#333'}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? '#333' : '#ff4d00',
              border: 'none', borderRadius: '8px',
              padding: '11px 16px', color: '#fff', fontSize: '18px',
              cursor: loading ? 'default' : 'pointer', transition: 'background 0.2s',
            }}
          >
            {loading ? <span className="spinner">⟳</span> : '🔍'}
          </button>
        </div>
      </div>

      <div style={{ padding: '14px 14px 0' }}>

        {/* Categories */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Categorías
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat)}
                style={{
                  background: activeCategory === cat.id ? 'rgba(255,77,0,0.12)' : '#111',
                  border: `1px solid ${activeCategory === cat.id ? '#ff4d00' : '#2a2a2a'}`,
                  borderRadius: '20px',
                  padding: '7px 14px',
                  color: activeCategory === cat.id ? '#ff4d00' : '#888',
                  fontSize: '12px', fontWeight: 600,
                  whiteSpace: 'nowrap', cursor: 'pointer',
                  fontFamily: 'inherit', letterSpacing: '0.03em',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Temas rápidos
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {TOPICS.map(t => (
              <span
                key={t}
                onClick={() => handleTopic(t)}
                style={{
                  background: '#1a1a1a', border: '1px solid #2a2a2a',
                  borderRadius: '4px', padding: '5px 10px',
                  fontSize: '12px', color: '#ccc',
                  letterSpacing: '0.04em', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.target.style.background = '#ff4d00'; e.target.style.color = '#000' }}
                onMouseLeave={e => { e.target.style.background = '#1a1a1a'; e.target.style.color = '#ccc' }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '56px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }} className="derrick">🛢️</div>
            <div style={{ color: '#ff4d00', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Buscando noticias...
            </div>
            <div style={{ color: '#333', fontSize: '11px', marginTop: '6px' }}>
              Consultando fuentes regionales
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: '#1a0800', border: '1px solid #ff4d00',
            borderRadius: '10px', padding: '16px',
            color: '#ff7040', fontSize: '14px', lineHeight: 1.5,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <div className="slide-up">

            {/* Summary */}
            <div style={{
              background: 'linear-gradient(135deg, #1a0e00, #150a00)',
              border: '1px solid #ff4d00',
              borderRadius: '12px', padding: '16px', marginBottom: '16px',
            }}>
              <div style={{ fontSize: '10px', color: '#ff4d00', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
                📡 Resumen Ejecutivo
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#e8e0d0' }}>{results.resumen}</p>
              {results.dato_clave && (
                <div style={{
                  marginTop: '12px', background: 'rgba(255,77,0,0.08)',
                  borderLeft: '3px solid #ff4d00', padding: '8px 12px',
                  borderRadius: '0 6px 6px 0',
                }}>
                  <span style={{ fontSize: '10px', color: '#ff4d00', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dato clave: </span>
                  <span style={{ fontSize: '14px', color: '#fff', fontWeight: 700 }}>{results.dato_clave}</span>
                </div>
              )}
            </div>

            {/* News cards */}
            <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Noticias encontradas ({results.noticias?.length || 0})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {results.noticias?.map((n, i) => (
                <div
                  key={i}
                  style={{
                    background: '#111', border: '1px solid #1e1e1e',
                    borderLeft: `3px solid ${impactColor(n.impacto)}`,
                    borderRadius: '10px', padding: '14px',
                    transition: 'transform 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '10px', background: '#1a1a1a',
                      border: '1px solid #2a2a2a', borderRadius: '4px',
                      padding: '3px 8px', color: '#777', letterSpacing: '0.06em',
                    }}>
                      {catIcon(n.categoria)} {n.categoria?.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '10px', color: impactColor(n.impacto), textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      ● {n.impacto}
                    </span>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '7px', lineHeight: 1.3, letterSpacing: '0.01em' }}>
                    {n.emoji} {n.titulo}
                  </div>
                  <p style={{ fontSize: '13px', color: '#999', lineHeight: 1.6 }}>{n.descripcion}</p>
                  {n.fuente && (
                    <div style={{ marginTop: '10px', fontSize: '11px', color: '#444' }}>
                      📰 {n.fuente}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Trend */}
            {results.tendencia && (
              <div style={{
                background: '#0a140a', border: '1px solid #1e3a1e',
                borderRadius: '10px', padding: '14px', marginBottom: '8px',
              }}>
                <div style={{ fontSize: '10px', color: '#4caf50', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  📊 Tendencia Regional
                </div>
                <p style={{ fontSize: '13px', color: '#a0c8a0', lineHeight: 1.6 }}>{results.tendencia}</p>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!results && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>🏔️</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#333', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Buscá noticias de tu región
            </div>
            <div style={{ fontSize: '13px', color: '#2a2a2a', lineHeight: 1.7, maxWidth: '280px', margin: '0 auto' }}>
              Petróleo, gas, real estate y economía del Alto Valle — todo con análisis en tiempo real.
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px 16px 8px', borderTop: '1px solid #111', marginTop: '16px' }}>
        <div style={{ fontSize: '10px', color: '#2a2a2a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Vaca Muerta News · Patagonia Argentina
        </div>
      </div>
    </div>
  )
}
