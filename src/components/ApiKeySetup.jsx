import { useState } from 'react'

export default function ApiKeySetup({ onSave }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  const handleSave = () => {
    if (!key.startsWith('sk-ant-')) {
      setError('La API key debe empezar con sk-ant-...')
      return
    }
    onSave(key.trim())
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Logo */}
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛢️</div>
      <div style={{
        fontSize: '28px',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: '#fff',
        marginBottom: '4px',
      }}>
        Vaca Muerta <span style={{ color: '#ff4d00' }}>News</span>
      </div>
      <div style={{ fontSize: '12px', color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '40px' }}>
        Alto Valle · Patagonia
      </div>

      {/* Card */}
      <div style={{
        background: '#111',
        border: '1px solid #222',
        borderRadius: '16px',
        padding: '24px',
        width: '100%',
        maxWidth: '360px',
      }}>
        <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '20px', lineHeight: 1.6 }}>
          Para usar la app necesitás una <strong style={{ color: '#ff4d00' }}>API key de Anthropic</strong>.
          Obtené la tuya gratis en{' '}
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#ff4d00', textDecoration: 'none' }}
          >
            console.anthropic.com
          </a>
        </div>

        <label style={{ fontSize: '11px', color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          Tu API Key
        </label>
        <input
          type="password"
          value={key}
          onChange={e => { setKey(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="sk-ant-api03-..."
          style={{
            width: '100%',
            background: '#1a1a1a',
            border: `1px solid ${error ? '#ff4d00' : '#333'}`,
            borderRadius: '8px',
            padding: '12px 14px',
            color: '#e8e0d0',
            fontSize: '14px',
            marginBottom: '8px',
          }}
        />
        {error && (
          <div style={{ fontSize: '12px', color: '#ff4d00', marginBottom: '12px' }}>{error}</div>
        )}

        <button
          onClick={handleSave}
          style={{
            width: '100%',
            background: '#ff4d00',
            border: 'none',
            borderRadius: '8px',
            padding: '14px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          Entrar →
        </button>

        <div style={{
          marginTop: '16px',
          fontSize: '11px',
          color: '#444',
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          🔒 Tu API key se guarda solo en tu dispositivo.<br />
          Nunca sale de tu navegador.
        </div>
      </div>
    </div>
  )
}
