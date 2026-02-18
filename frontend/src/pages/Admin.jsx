import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Admin() {
  const { user, token } = useContext(AuthContext)
  const [tab, setTab] = useState('orders')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.rol !== 'admin') return
    fetchData()
  }, [tab, user])

  const fetchData = async () => {
    setLoading(true)
    const endpoint = tab === 'users' ? '/api/users' : 
                     tab === 'products' ? '/api/products' : '/api/orders/all'
    try {
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const result = await res.json()
      setData(tab === 'users' ? result.users : 
              tab === 'products' ? result.products : result.pedidos)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const updateOrderStatus = async (orderId, estado_envio) => {
    try {
      await fetch(`/api/orders/${orderId}/shipping`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado_envio })
      })
      fetchData()
    } catch (err) {
      alert('Error al actualizar')
    }
  }

  if (!user || user.rol !== 'admin') {
    return (
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-6xl text-red-500 mb-4">lock</span>
        <h2 className="text-2xl font-extrabold">Acceso Denegado</h2>
        <p className="text-[#606e8a] mt-2">Solo administradores pueden acceder a esta página.</p>
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
      <h1 className="text-3xl font-extrabold mb-8">Panel de Administración</h1>
      
      <div className="flex gap-2 mb-8">
        {['orders', 'users', 'products'].map(t => (
          <button 
            key={t}
            onClick={() => setTab(t)} 
            className={`px-6 py-3 rounded-xl font-bold transition-colors ${tab === t ? 'bg-primary text-white' : 'bg-[#f0f1f5] hover:bg-primary/10'}`}
          >
            {t === 'orders' ? 'Pedidos' : t === 'users' ? 'Usuarios' : 'Productos'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center py-10">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tab === 'orders' && data.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-lg">Pedido #{order.id}</h3>
                <div className="flex gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.estado_pago)}`}>
                    {order.estado_pago}
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#606e8a] mb-2">{order.usuario_nombre} ({order.usuario_email})</p>
              <p className="font-bold text-primary text-xl mb-4">${Number(order.total).toFixed(2)}</p>
              <p className="text-xs text-[#606e8a] mb-4">{order.direccion_envio}</p>
              <select
                value={order.estado_envio}
                onChange={e => updateOrderStatus(order.id, e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#f0f1f5] bg-white focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="pendiente">Pendiente</option>
                <option value="procesando">Procesando</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>
          ))}

          {tab === 'users' && data.map(u => (
            <div key={u.id} className="bg-white p-6 rounded-xl">
              <h3 className="font-bold text-lg">{u.nombre} {u.apellido}</h3>
              <p className="text-sm text-[#606e8a]">{u.email}</p>
              <div className="flex gap-2 mt-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.rol === 'admin' ? 'bg-primary text-white' : 'bg-[#f0f1f5] text-[#111318]'}`}>
                  {u.rol}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {u.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          ))}

          {tab === 'products' && data.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-xl">
              <div className="aspect-square bg-[#f0f1f5] rounded-lg mb-4 overflow-hidden">
                {p.imagen ? (
                  <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-[#606e8a]">{p.nombre[0]}</div>
                )}
              </div>
              <h3 className="font-bold">{p.nombre}</h3>
              <p className="text-primary font-extrabold text-lg">${Number(p.precio).toFixed(2)}</p>
              <p className="text-sm text-[#606e8a]">Stock: {p.stock}</p>
              <p className="text-sm text-[#606e8a]">{p.categoria_nombre}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
