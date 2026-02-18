import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ categoria: '', search: '' })

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ]).then(([productsData, categoriesData]) => {
      setProducts(productsData.products || productsData)
      setCategories(categoriesData)
    }).catch(err => console.error(err))
    .finally(() => setLoading(false))
  }, [])

  const filteredProducts = products.filter(p => {
    if (filters.categoria && p.categoria_nombre !== filters.categoria) return false
    if (filters.search && !p.nombre.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Todos los Productos</h1>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          className="px-4 py-2 rounded-xl border border-[#f0f1f5] bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
        <select
          value={filters.categoria}
          onChange={e => setFilters({ ...filters, categoria: e.target.value })}
          className="px-4 py-2 rounded-xl border border-[#f0f1f5] bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
        </select>
      </div>
      
      {loading ? (
        <p className="text-center py-10">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Link to={`/products/${product.id}`} key={product.id} className="group flex flex-col gap-4">
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
                <p className="text-sm text-[#606e8a] font-medium">{product.categoria_nombre}</p>
                <h3 className="font-bold text-lg">{product.nombre}</h3>
                <p className="text-primary font-extrabold text-xl">${Number(product.precio).toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
