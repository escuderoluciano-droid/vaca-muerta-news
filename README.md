# 🛢️ Vaca Muerta News

App PWA de noticias sobre petróleo, economía e inmobiliario del Alto Valle patagónico.
Funciona en el navegador y se puede instalar como app en el celular (iOS/Android).

---

## ⚡ Deploy rápido en Vercel (recomendado)

### 1. Requisitos previos
- Cuenta gratuita en [vercel.com](https://vercel.com)
- Cuenta en [github.com](https://github.com) (para subir el código)
- Node.js instalado en tu compu ([nodejs.org](https://nodejs.org))

### 2. Instalá las dependencias
```bash
npm install
```

### 3. Probá en local
```bash
npm run dev
```
Abrí http://localhost:3000 en el navegador.

### 4. Subí a GitHub
```bash
git init
git add .
git commit -m "Vaca Muerta News"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/vaca-muerta-news.git
git push -u origin main
```

### 5. Deploy en Vercel
1. Entrá a [vercel.com](https://vercel.com) y hacé login con GitHub
2. Click en **"New Project"**
3. Seleccioná tu repositorio `vaca-muerta-news`
4. Click en **"Deploy"** (Vercel detecta Vite automáticamente)
5. En 2 minutos tenés tu URL: `https://vaca-muerta-news.vercel.app`

---

## 📱 Instalar como app en el celular (PWA)

### En Android (Chrome):
1. Abrí la URL de tu app en Chrome
2. Tocá el menú (⋮) → "Agregar a pantalla de inicio"
3. Confirmá → La app aparece como ícono en el inicio

### En iPhone (Safari):
1. Abrí la URL en Safari
2. Tocá el botón Compartir (□↑)
3. Seleccioná "Agregar a pantalla de inicio"
4. Confirmá → Lista como app nativa

---

## 🔑 API Key de Anthropic

La app te pide una API key de Anthropic la primera vez.

1. Creá cuenta en [console.anthropic.com](https://console.anthropic.com)
2. Andá a **API Keys** → **Create Key**
3. Copiá la clave (empieza con `sk-ant-...`)
4. Pegala en la app

> La API key se guarda solo en tu dispositivo (localStorage). Nunca se envía a ningún servidor externo.

### Costos estimados
- Cada búsqueda consume aprox. **$0.01 - $0.03 USD** (incluye web search)
- Con $5 USD tenés ~200-500 búsquedas
- Anthropic da créditos gratis al registrarte

---

## 🗂️ Estructura del proyecto

```
vaca-muerta-news/
├── index.html              # Entry point HTML
├── vite.config.js          # Config Vite + PWA
├── package.json            # Dependencias
├── public/                 # Assets estáticos
│   └── icons/              # Íconos PWA (agregar manualmente)
└── src/
    ├── main.jsx            # Entry point React
    ├── App.jsx             # Lógica de API key
    ├── index.css           # Estilos globales + animaciones
    └── components/
        ├── ApiKeySetup.jsx # Pantalla de configuración inicial
        └── NewsSearch.jsx  # App principal de búsqueda
```

---

## 🎨 Personalización

### Agregar más categorías
En `NewsSearch.jsx`, editá el array `CATEGORIES`:
```js
{ id: 'neuquen', label: '🏛️ Neuquén Capital', query: 'Neuquén capital noticias económicas municipio' },
```

### Agregar más temas rápidos
Editá el array `TOPICS` en `NewsSearch.jsx`.

### Cambiar el prompt del asistente
Editá la constante `SYSTEM_PROMPT` para ajustar qué tipo de noticias prioriza.

---

## 🛠️ Tecnologías

- **React 18** + **Vite 5** — build ultrarrápido
- **vite-plugin-pwa** — soporte PWA / instalación móvil
- **Anthropic Claude API** — análisis de noticias con IA
- **Web Search Tool** — búsqueda en tiempo real

---

## ❓ Problemas comunes

**"Error 401 - API key inválida"**
→ Verificá que la key empiece con `sk-ant-` y esté completa.

**"Error 429 - Too many requests"**
→ Esperá 30 segundos e intentá de nuevo.

**La app no carga en móvil**
→ Asegurate de usar HTTPS (Vercel lo da automáticamente).

**El PWA no aparece para instalar**
→ Verificá que estés usando Chrome (Android) o Safari (iOS).
