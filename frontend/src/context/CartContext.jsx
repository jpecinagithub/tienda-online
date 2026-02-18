import { createContext, useState, useEffect } from 'react'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.producto_id === product.id)
      if (existing) {
        return prev.map(item => 
          item.producto_id === product.id 
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        )
      }
      return [...prev, { 
        producto_id: product.id, 
        nombre: product.nombre, 
        precio: Number(product.precio), 
        imagen: product.imagen,
        cantidad: quantity 
      }]
    })
  }

  const removeItem = (producto_id) => {
    setItems(prev => prev.filter(item => item.producto_id !== producto_id))
  }

  const updateQuantity = (producto_id, cantidad) => {
    if (cantidad <= 0) {
      removeItem(producto_id)
      return
    }
    setItems(prev => prev.map(item => 
      item.producto_id === producto_id ? { ...item, cantidad } : item
    ))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  const count = items.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}
