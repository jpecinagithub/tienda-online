import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Orders() {
  const { token } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOrders(data.pedidos || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <p className="text-center py-10">Cargando...</p>

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-6xl text-[#606e8a] mb-4">receipt_long</span>
        <h2 className="text-2xl font-extrabold mb-4">No tienes pedidos</h2>
        <Link to="/products" className="text-primary font-bold hover:underline">Ver productos</Link>
      </div>
    )
  }

  const getStatusColor = (status) => {
    if (status === 'aprobado' || status === 'entregado') return 'bg-green-100 text-green-700'
    if (status === 'rechazado') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Mis Pedidos</h1>
      <div className="flex flex-col gap-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-extrabold">Pedido #{order.id}</h3>
                <p className="text-sm text-[#606e8a]">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.estado_pago)}`}>
                  {order.estado_pago}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.estado_envio)}`}>
                  {order.estado_envio}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg">Total: <strong className="text-primary text-xl">${Number(order.total).toFixed(2)}</strong></p>
              {order.numero_seguimiento && (
                <p className="text-sm text-[#606e8a]">Seguimiento: <span className="font-mono font-bold">{order.numero_seguimiento}</span></p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
