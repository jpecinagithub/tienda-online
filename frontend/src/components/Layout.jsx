import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'

export default function Layout() {
  const { user, logout } = useContext(AuthContext)
  const cart = useContext(CartContext)
  const count = cart?.count || 0
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-solid border-[#f0f1f5] px-6 lg:px-20 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-2xl">bolt</span>
              </div>
              <h2 className="text-[#111318] text-xl font-extrabold">Tienda Online</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-[#111318] text-sm font-bold hover:text-primary transition-colors">Inicio</Link>
              <Link to="/products" className="text-[#111318] text-sm font-bold hover:text-primary transition-colors">Productos</Link>
            </nav>
          </div>
          <div className="flex flex-1 justify-end items-center gap-4">
            <Link to="/cart" className="p-2.5 rounded-xl bg-[#f0f1f5] hover:bg-primary/10 transition-colors text-[#111318] relative">
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{count}</span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/orders" className="text-sm font-bold hover:text-primary transition-colors">Mis Pedidos</Link>
                <Link to="/profile" className="text-sm font-bold hover:text-primary transition-colors">Perfil</Link>
                {user.rol === 'admin' && <Link to="/admin" className="text-sm font-bold hover:text-primary transition-colors">Admin</Link>}
                <button onClick={handleLogout} className="bg-red-500 text-white border-none px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-600 transition-colors">Cerrar Sesión</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-bold hover:text-primary transition-colors">Login</Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform">Registro</Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-[1440px] mx-auto px-6 lg:px-20 py-8">
        <Outlet />
      </main>
    </div>
  )
}
