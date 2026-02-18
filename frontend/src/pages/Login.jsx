import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center mb-8">Iniciar Sesión</h2>
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-4 py-3 rounded-xl border border-[#f0f1f5] focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-3 rounded-xl border border-[#f0f1f5] focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            required
          />
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform mt-4">
            Iniciar Sesión
          </button>
        </form>
        <p className="text-center mt-6 text-[#606e8a]">
          ¿No tienes cuenta? <Link to="/register" className="text-primary font-bold hover:underline">Regístrate</Link>
        </p>
        <div className="mt-8 p-4 bg-[#f0f1f5] rounded-xl text-sm">
          <p className="font-bold mb-2">Credenciales de prueba:</p>
          <p><strong>Admin:</strong> admin@tienda.com / 12345678</p>
          <p><strong>Cliente:</strong> cliente@tienda.com / 12345678</p>
        </div>
      </div>
    </div>
  )
}
