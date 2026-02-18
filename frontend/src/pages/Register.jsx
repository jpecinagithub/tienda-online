import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const [formData, setFormData] = useState({
    email: '', password: '', nombre: '', apellido: '', telefono: '', direccion: ''
  })
  const [error, setError] = useState('')
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(formData)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center mb-8">Crear Cuenta</h2>
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="email" type="email" placeholder="Email *" value={formData.email} onChange={handleChange} className="px-4 py-3 rounded-xl border border-[#f0f1f5] focus:ring-2 focus:ring-primary focus:border-primary outline-none" required />
          <input name="password" type="password" placeholder="Contraseña *" value={formData.password} onChange={handleChange} className="px-4 py-3 rounded-xl border border-[#f0f1f5] focus:ring-2 focus:ring-primary focus:border-primary outline-none" required />
          <input name="nombre" type="text" placeholder="Nombre *" value={formData.nombre} onChange={handleChange} className="px-4 py-3 rounded-xl border border-[#f0f1f5] focus:ring-2 focus:ring-primary focus:border-primary outline-none" required />
          <input name="apellido" type="text" placeholder="Apellido *" value={formData.apellido} onChange={handleChange} className="px-4 py-3 rounded-xl border border-[#f0f1f5] focus:ring-2 focus:ring-primary focus:border-primary outline-none" required />
          <input name="telefono" type="text" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className="px-4 py-3 rounded-xl border border-[#f0f1f5] focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
          <input name="direccion" type="text" placeholder="Dirección" value={formData.direccion} onChange={handleChange} className="px-4 py-3 rounded-xl border border-[#f0f1f5] focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform mt-4">
            Registrarse
          </button>
        </form>
        <p className="text-center mt-6 text-[#606e8a]">
          ¿Ya tienes cuenta? <Link to="/login" className="text-primary font-bold hover:underline">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  )
}
