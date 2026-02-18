# API TIENDA ONLINE - Documentación de Endpoints

Base URL: `http://localhost:3001/api`

---

## Autenticación

### POST /auth/register
Registrar nuevo usuario.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "12345678",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "600000000",
  "direccion": "Calle 123, Ciudad"
}
```

**Respuesta:**
```json
{
  "user": { "id": 1, "email": "...", "nombre": "...", "rol": "cliente" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### POST /auth/login
Iniciar sesión.

**Body:**
```json
{
  "email": "admin@tienda.com",
  "password": "12345678"
}
```

**Respuesta:**
```json
{
  "user": { "id": 1, "email": "...", "nombre": "...", "rol": "admin" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### GET /auth/profile
Obtener perfil del usuario autenticado. Requiere token JWT.

**Headers:** `Authorization: Bearer <token>`

**Respuesta:**
```json
{
  "id": 1,
  "email": "admin@tienda.com",
  "nombre": "Admin",
  "apellido": "Principal",
  "telefono": "600000001",
  "direccion": "Calle Admin 1, Madrid",
  "rol": "admin",
  "activo": true
}
```

---

### PUT /auth/profile
Actualizar perfil del usuario autenticado.

**Body:**
```json
{
  "nombre": "Nuevo Nombre",
  "telefono": "600000000"
}
```

---

## Usuarios (Admin)

### GET /users
Listar usuarios (solo admin). Soporta paginación y filtros.

**Query Params:**
- `page` (default: 1)
- `limit` (default: 20)
- `rol` (cliente | admin)
- `activo` (true | false)

**Headers:** `Authorization: Bearer <token_admin>`

---

### GET /users/:id
Obtener usuario por ID.

---

### POST /users
Crear usuario (solo admin).

**Body:**
```json
{
  "email": "nuevo@tienda.com",
  "password": "12345678",
  "nombre": "Nuevo",
  "apellido": "Usuario",
  "rol": "cliente"
}
```

---

### PUT /users/:id
Actualizar usuario (solo admin).

---

### DELETE /users/:id
Eliminar usuario (solo admin).

---

## Productos

### GET /products
Listar productos públicos.

**Query Params:**
- `page`, `limit`
- `categoria` (nombre de categoría)
- `minPrecio`, `maxPrecio`
- `destacado` (true)
- `search` (texto en nombre/descripción)

---

### GET /products/featured
Listar productos destacados.

---

### GET /products/:id
Obtener producto por ID.

---

### POST /products
Crear producto (solo admin).

---

### PUT /products/:id
Actualizar producto (solo admin).

---

### DELETE /products/:id
Eliminar producto (solo admin).

---

## Categorías

### GET /categories
Listar categorías públicas.

---

### GET /categories/:id
Obtener categoría por ID.

---

### POST /categories
Crear categoría (solo admin).

---

### PUT /categories/:id
Actualizar categoría (solo admin).

---

### DELETE /categories/:id
Eliminar categoría (solo admin).

---

## Pedidos

### POST /orders
Crear nuevo pedido (requiere autenticación).

**Body:**
```json
{
  "items": [
    { "producto_id": 1, "cantidad": 2 },
    { "producto_id": 5, "cantidad": 1 }
  ],
  "direccion_envio": "Calle 123, Madrid",
  "metodo_pago": "tarjeta"
}
```

**Respuesta:**
```json
{
  "pedido": { "id": 1, "total": 299.99, "estado_pago": "aprobado", ... },
  "detalles": [...],
  "simulacion": {
    "pago": { "estado": "aprobado", "transaccion_id": "..." },
    "envio": { "numero_seguimiento": "ABC123", "estado": "pendiente" }
  }
}
```

*Nota: El pago se simula con 90% de aprobación aleatoria.*

---

### GET /orders/my
Listar pedidos del usuario autenticado.

---

### GET /orders/my/:id
Obtener detalle de un pedido específico.

---

### GET /orders/all
Listar todos los pedidos (solo admin).

**Query Params:**
- `page`, `limit`
- `estado_pago` (pendiente | aprobado | rechazado)
- `estado_envio` (pendiente | procesando | enviado | entregado)

---

### PUT /orders/:id/status
Actualizar estado del pedido (solo admin).

**Body:**
```json
{
  "estado_pago": "aprobado",
  "estado_envio": "enviado"
}
```

---

### PUT /orders/:id/shipping
Simular actualización de envío (solo admin).

**Body:**
```json
{
  "estado_envio": "enviado"
}
```

*Estados válidos: pendiente → procesando → enviado → entregado*

---

## Health Check

### GET /api/health
Verificar que el servidor está funcionando.

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token requerido o inválido |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error |
