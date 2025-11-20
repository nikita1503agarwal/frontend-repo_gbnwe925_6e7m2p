import Product from './components/Product'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />

      <header className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600" />
            <div className="text-white font-semibold tracking-tight">MJ Figurines</div>
          </div>
          <nav className="text-blue-200/80 text-sm">
            Premium collectible with customizable base
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 pb-24 pt-8">
          <Product />
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 py-8 text-blue-200/70 text-sm flex items-center justify-between">
          <div>Secure checkout • Worldwide shipping</div>
          <div>Made of plastic • 10 cm × 30 cm</div>
        </div>
      </footer>
    </div>
  )
}

export default App
