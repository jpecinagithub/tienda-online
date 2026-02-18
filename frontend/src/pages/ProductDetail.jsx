import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err))
  }, [id])

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      addItem(product, quantity)
      alert('Producto añadido al carrito')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Error al añadir al carrito')
    }
  }

  if (!product) return <p className="text-center py-10">Cargando...</p>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-xl">
      <div className="flex items-center justify-center">
        <div className="relative aspect-square w-full max-w-md rounded-xl overflow-hidden bg-[#f0f1f5]">
          {product.imagen ? (
            <img src={product.imagen} alt={product.nombre} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[8rem] text-[#606e8a]">{product.nombre[0]}</div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm text-[#606e8a] font-medium mb-2">{product.categoria_nombre}</p>
          <h1 className="text-4xl font-extrabold tracking-tight">{product.nombre}</h1>
        </div>
        <p className="text-lg text-[#606e8a]">{product.descripcion}</p>
        <div>
          <p className="text-4xl font-extrabold text-primary">${Number(product.precio).toFixed(2)}</p>
          <p className="text-[#606e8a]">Stock disponible: {product.stock} unidades</p>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center bg-[#f0f1f5] rounded-xl">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-3 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <span className="px-4 font-bold">{quantity}</span>
            <button 
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="px-4 py-3 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
          <button 
            onClick={handleAddToCart} 
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add_shopping_cart</span>
            Añadir al Carrito
          </button>
        </div>

        <Link to="/products" className="text-primary font-bold flex items-center gap-1 hover:underline mt-4">
          <span className="material-symbols-outlined">arrow_back</span>
          Volver a productos
        </Link>
      </div>
    </div>
  )
}
