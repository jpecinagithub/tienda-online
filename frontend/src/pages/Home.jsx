import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products/featured')
      .then(res => res.json())
      .then(data => setFeatured(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <section className="py-10">
        <div className="relative overflow-hidden rounded-xl bg-primary/5 min-h-[500px] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full items-center gap-10 p-8 lg:p-16">
            <div className="z-10 flex flex-col gap-8">
              <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                Nueva Colección 2024
              </div>
              <h1 className="text-[#111318] text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tighter">
                Define tu <span className="text-primary">Estilo</span>. Vive la Tendencia.
              </h1>
              <p className="text-lg text-[#606e8a] max-w-md leading-relaxed">
                La moda que pega fuerte. Únete a la crew y descubre lo más hot del momento en streetwear y tecnología.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform inline-block text-center">
                  Comprar Ahora
                </Link>
                <Link to="/products" className="bg-white border-2 border-[#f0f1f5] text-[#111318] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#f0f1f5] transition-colors inline-block text-center">
                  Ver Catálogo
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[600px] w-full hidden lg:block">
              <img alt="Fashion" className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-2xl rotate-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIfGufJu_TF-_HKMo1JYDhFYAJghghqfC6r84bjfmXv77ptvjQGSqXsrA8cSuMPqgaCjuFqZEQRt9Yh6PdFbOM83_buxSGdYggyqJKxkqSIFUO-xfWsxdFDjYAOZD8QqQTQU02sP9rb3oIP2FkXZPgPfGPUzCfx5DLjwqEiFx46nkqMpZ9CcDz78CPxjB6FEAkvXOFi29XDw1nCsZtv0mZ1ohGSj3bHec9j7rKhP7eZwDaGeIw9HywqaX4b48kXoL_uYwHMpRBMZLl" />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Lo más Hot del Momento</h2>
            <p className="text-[#606e8a] mt-2">Los favoritos de la comunidad esta semana.</p>
          </div>
          <Link to="/products" className="text-primary font-bold flex items-center gap-1 hover:underline">
            Ver todos <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
        
        {loading ? (
          <p className="text-center py-10">Cargando...</p>
        ) : (
          <div className="flex overflow-x-auto gap-6 hide-scrollbar pb-4">
            {featured.map(product => (
              <Link to={`/products/${product.id}`} key={product.id} className="min-w-[280px] group flex flex-col gap-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#f0f1f5]">
                  {product.imagen ? (
                    <img src={product.imagen} alt={product.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-[#606e8a]">{product.nombre[0]}</div>
                  )}
                  <button className="absolute bottom-4 right-4 bg-white p-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="material-symbols-outlined text-primary">add_shopping_cart</span>
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{product.nombre}</h3>
                  <p className="text-primary font-extrabold text-xl">${Number(product.precio).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="py-12">
        <div className="bg-primary rounded-xl p-8 lg:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="text-white z-10 text-center lg:text-left">
            <div className="inline-block bg-white text-primary px-3 py-1 rounded-lg text-sm font-black mb-4">
              SÓLO POR 2 HORAS
            </div>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4">
              OFERTAS RELÁMPAGO
            </h2>
            <p className="text-white/80 text-lg">Descuentos de hasta el 40% en artículos seleccionados.</p>
          </div>
          <Link to="/products" className="bg-white text-primary px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-background-light transition-colors whitespace-nowrap z-10">
            Ver Rebajas
          </Link>
        </div>
      </section>
    </div>
  )
}
