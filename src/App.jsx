import { useState, useEffect } from 'react'
import NewsSearch from './components/NewsSearch.jsx'
import ApiKeySetup from './components/ApiKeySetup.jsx'

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('vm_api_key') || '')

  const handleSaveKey = (key) => {
    localStorage.setItem('vm_api_key', key)
    setApiKey(key)
  }

  const handleClearKey = () => {
    localStorage.removeItem('vm_api_key')
    setApiKey('')
  }

  if (!apiKey) {
    return <ApiKeySetup onSave={handleSaveKey} />
  }

  return <NewsSearch apiKey={apiKey} onClearKey={handleClearKey} />
}
