import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Profile() {
  const { user, updateProfile } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', telefono: '', direccion: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        telefono: user.telefono || '',
        direccion: user.direccion || ''
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(formData)
      setMessage('Perfil actualizado correctamente')
    } catch (err) {
      setMessage(err.message)
    }
  }

  if (!user) return <p className="text-center py-10">Debes iniciar sesión</p>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8">Mi Perfil</h1>
      
      <div className="bg-white p-6 rounded-xl mb-8">
        <h2 className="text-xl font-bold mb-4">Información de Cuenta</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[#606e8a]">Email</p>
            <p className="font-bold">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-[#606e8a]">Rol</p>
            <p className="font-bold capitalize">{user.rol}</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-6">Actualizar Datos</h2>
        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.includes('correctamente') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={e => setFormData({ ...formData, nombre: e.target.value })}
            className="px-4 py-3 rounded-xl border border-[#f0f1f5] focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={e => setFormData({ ...formData, apellido: e.target.value })}
            className="px-4 py-3 rounded-xl border border-[#f0f1f5] focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={e => setFormData({ ...formData, telefono: e.target.value })}
            className="px-4 py-3 rounded-xl border border-[#f0f1f5] focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={e => setFormData({ ...formData, direccion: e.target.value })}
            className="px-4 py-3 rounded-xl border border-[#f0f1f5] focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform">
          Guardar Cambios
        </button>
      </form>
    </div>
  )
}
