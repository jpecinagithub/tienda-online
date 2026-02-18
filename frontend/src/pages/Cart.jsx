import { useContext, useState } from 'react'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total } = useContext(CartContext)
  const { user, token } = useContext(AuthContext)
  const [direccion, setDireccion] = useState(user?.direccion || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const navigate = useNavigate()

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!direccion) {
      alert('Por favor, ingresa una dirección de envío')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({ producto_id: item.producto_id, cantidad: item.cantidad })),
          direccion_envio: direccion,
          metodo_pago: 'tarjeta'
        })
      })
      const data = await res.json()
      setResult(data)
      if (data.simulacion?.pago?.estado === 'aprobado') {
        clearCart()
      }
    } catch (err) {
      alert('Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl text-center">
        <h2 className="text-3xl font-extrabold mb-6">Resultado del Pedido</h2>
        <div className={`p-6 rounded-xl mb-6 ${result.simulacion?.pago?.estado === 'aprobado' ? 'bg-green-100' : 'bg-red-100'}`}>
          <h3 className="text-xl font-bold mb-2">Pago: {result.simulacion?.pago?.estado?.toUpperCase()}</h3>
          <p className="text-[#606e8a]">{result.simulacion?.pago?.mensaje}</p>
        </div>
        {result.simulacion?.envio && (
          <div className="bg-[#f0f1f5] p-6 rounded-xl mb-6 text-left">
            <h4 className="font-bold mb-2">Información de Envío</h4>
            <p>Número de seguimiento: <span className="font-extrabold">{result.simulacion?.envio?.numero_seguimiento}</span></p>
            <p>Estado: <span className="font-extrabold">{result.simulacion?.envio?.estado}</span></p>
          </div>
        )}
        <button onClick={() => { setResult(null); navigate('/orders'); }} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
          Ver Mis Pedidos
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-6xl text-[#606e8a] mb-4">shopping_bag</span>
        <h2 className="text-2xl font-extrabold mb-4">Tu carrito está vacío</h2>
        <Link to="/products" className="text-primary font-bold hover:underline">Ver productos</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Carrito de Compras</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map(item => (
            <div key={item.producto_id} className="flex items-center gap-4 bg-white p-4 rounded-xl">
              <div className="w-24 h-24 bg-[#f0f1f5] rounded-lg overflow-hidden flex-shrink-0">
                {item.imagen ? (
                  <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-[#606e8a]">{item.nombre[0]}</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.nombre}</h3>
                <p className="text-primary font-extrabold">${Number(item.precio).toFixed(2)}</p>
              </div>
              <div className="flex items-center bg-[#f0f1f5] rounded-xl">
                <button onClick={() => updateQuantity(item.producto_id, item.cantidad - 1)} className="px-3 py-2 hover:text-primary transition-colors">-</button>
                <span className="px-3 font-bold">{item.cantidad}</span>
                <button onClick={() => updateQuantity(item.producto_id, item.cantidad + 1)} className="px-3 py-2 hover:text-primary transition-colors">+</button>
              </div>
              <button onClick={() => removeItem(item.producto_id)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-xl h-fit">
          <h3 className="text-xl font-extrabold mb-4">Resumen</h3>
          <div className="flex justify-between mb-2">
            <span className="text-[#606e8a]">Subtotal</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-[#606e8a]">Envío</span>
            <span className="font-bold text-green-600">Gratis</span>
          </div>
          <div className="border-t border-[#f0f1f5] pt-4 mb-6">
            <div className="flex justify-between">
              <span className="font-extrabold text-lg">Total</span>
              <span className="font-extrabold text-lg text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
          <textarea
            placeholder="Dirección de envío"
            value={direccion}
            onChange={e => setDireccion(e.target.value)}
            className="w-full p-4 rounded-xl border border-[#f0f1f5] focus:ring-2 focus:ring-primary focus:border-primary outline-none mb-4"
            rows={3}
          />
          <button 
            onClick={handleCheckout} 
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Realizar Pedido'}
          </button>
        </div>
      </div>
    </div>
  )
}
