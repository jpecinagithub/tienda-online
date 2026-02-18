# Tests y Verificaciones - Tienda Online

## Backend ✅ PASSED

### 1. Autenticación
- [x] Registro de usuario con datos válidos ✅
- [x] Registro de usuario con email duplicado (debe fallar) ✅
- [x] Login con credenciales correctas ✅
- [x] Login con password incorrecto (debe fallar) ✅
- [x] Obtener perfil con token válido ✅
- [x] Obtener perfil sin token (debe fallar con 401) ✅
- [x] Actualizar perfil ✅

### 2. Productos
- [x] Listar productos públicos ✅
- [x] Filtrar por categoría ✅
- [x] Buscar productos por nombre ✅
- [x] Obtener producto por ID ✅
- [x] Productos destacados ✅

### 3. Pedidos
- [x] Crear pedido (con simulate de pago) ✅
- [x] Crear pedido con stock insuficiente (debe fallar) ✅
- [x] Ver mis pedidos ✅
- [x] Ver detalle de pedido ✅

### 4. Admin
- [x] Listar usuarios (solo admin) ✅
- [x] Crear usuario (solo admin) ✅
- [x] Actualizar usuario (solo admin) ✅
- [x] Listar todos los pedidos (solo admin) ✅
- [x] Actualizar estado de envío (solo admin) ✅

---

## Frontend

### 1. Navegación
- [ ] Página de inicio carga correctamente
- [ ] Navegación a productos
- [ ] Navegación a detalle de producto
- [ ] Links de login/registro

### 2. Carrito
- [ ] Añadir producto al carrito
- [ ] Ver carrito con productos
- [ ] Actualizar cantidad
- [ ] Eliminar producto del carrito
- [ ] Total del carrito correcto
- [ ] Checkout (crear pedido)

### 3. Usuario
- [ ] Registro de nuevo usuario
- [ ] Login correcto
- [ ] Login con credenciales incorrectas (muestra error)
- [ ] Ver mis pedidos
- [ ] Actualizar perfil

### 4. Admin
- [ ] Panel de admin accesible solo para admin
- [ ] Ver pedidos
- [ ] Actualizar estado de envío
- [ ] Ver usuarios
- [ ] Ver productos

---

## Integración

- [ ] Usuario puede registrarse, login, añadir al carrito y comprar
- [x] Pago simulado funciona (90% éxito)
- [x] Seguimiento de envío actualizable por admin
- [x] Imágenes de productos se muestran correctamente
- [ ] Carrito persiste en localStorage

---

## Errores a Verificar

- [ ] No mostrar pantalla en blanco en ningún caso
- [ ] Manejo de errores de red
- [ ] Validación de formularios
- [ ] Tokens expirados redireccionan a login

---

## Resumen de Tests Backend

| Endpoint | Método | Resultado |
|----------|--------|-----------|
| /api/health | GET | ✅ OK |
| /api/auth/register | POST | ✅ OK |
| /api/auth/login | POST | ✅ OK |
| /api/auth/profile | GET | ✅ OK |
| /api/products | GET | ✅ OK |
| /api/products?categoria= | GET | ✅ OK |
| /api/products?search= | GET | ✅ OK |
| /api/products/featured | GET | ✅ OK |
| /api/categories | GET | ✅ OK |
| /api/orders | POST | ✅ OK |
| /api/orders/:id/shipping | PUT | ✅ OK |
| /api/users | GET | ✅ OK (solo con token) |
| Sin token | - | ✅ 401 error |
| Email duplicado | POST | ✅ Error correcto |
| Password incorrecto | POST | ✅ Error correcto |
| Stock insuficiente | POST | ✅ Error correcto |

---

## Issues Encontrados y Solucionados

1. ✅ Error en CartContext.jsx: `cantidad` no estaba definido - CORREGIDO
2. ✅ Error de sintaxis en Cart.jsx: `quantityControls button` - CORREGIDO
3. ✅ Precio como string de MySQL - CORREGIDO con `Number()`
4. ✅ Imágenes no se mostraban - AÑADIDAS a BDD
5. ✅ Password de usuarios no funcionaba - ACTUALIZADO hash bcrypt
6. ✅ Estilos actualizados con Tailwind CSS
