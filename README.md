# Tienda Online - Guía de Instalación y Ejecución

## Requisitos Previos

- Node.js 18+
- MySQL 8.0+
- npm o yarn

---

## 1. Base de Datos

### 1.1 Crear la base de datos

```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar scripts
SOURCE /ruta/a/database.sql;
SOURCE /ruta/a/seed.sql;
```

O desde MySQL Workbench:
1. Ejecutar `database.sql`
2. Ejecutar `seed.sql`

### 1.2 Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@tienda.com | 12345678 |
| Cliente | cliente@tienda.com | 12345678 |

---

## 2. Backend

### 2.1 Instalar dependencias

```bash
cd backend
npm install
```

### 2.2 Configurar variables de entorno

Editar `backend/.env`:

```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=tienda_online
JWT_SECRET=tu_secreto_jwt_seguro
JWT_EXPIRES_IN=7d
```

### 2.3 Ejecutar el backend

```bash
# Desarrollo (con watch)
npm run dev

# Producción
npm start
```

El backend estará disponible en: `http://localhost:3001`

---

## 3. Frontend

### 3.1 Instalar dependencias

```bash
cd frontend
npm install
```

### 3.2 Ejecutar el frontend

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 4. Probar la API

### 4.1 Con VS Code REST Client

1. Abrir `peticiones.rest`
2. Ejecutar las peticiones en orden:
   - Login como admin para obtener token
   - Copiar token en las variables `@tokenAdmin`
   - Probar endpoints

### 4.2 Endpoints principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/register | Registrarse |
| GET | /api/products | Listar productos |
| POST | /api/orders | Crear pedido |
| GET | /api/orders/my | Mis pedidos |

---

## 5. Estructura del Proyecto

```
/opencode
  ├── backend/
  │   ├── src/
  │   │   ├── config/database.js
  │   │   ├── controllers/
  │   │   ├── middleware/auth.js
  │   │   ├── routes/
  │   │   └── server.js
  │   ├── .env
  │   └── package.json
  ├── frontend/
  │   ├── src/
  │   │   ├── components/
  │   │   ├── context/
  │   │   ├── pages/
  │   │   ├── App.jsx
  │   │   └── main.jsx
  │   ├── index.html
  │   ├── vite.config.js
  │   └── package.json
  ├── database.sql
  ├── seed.sql
  ├── endpoints.md
  └── peticiones.rest
```

---

## 6. Funcionalidades

### Cliente
- Registro/Login
- Ver productos
- Añadir al carrito
- Realizar pedido (simulación de pago 90% éxito)
- Ver historial de pedidos
- Actualizar perfil

### Administrador
- Panel de administración
- Gestionar usuarios
- Gestionar productos
- Ver todos los pedidos
- Actualizar estado de envío

---

## 7. Solución de Problemas

### Error de conexión a MySQL
- Verificar que MySQL esté corriendo
- Comprobar credenciales en `.env`
- Crear la base de datos manualmente

### Error CORS
- El frontend tiene proxy configurado en `vite.config.js`
- Asegúrate de ejecutar desde `frontend/`

### Token expirado
- Iniciar sesión nuevamente
- Los tokens duran 7 días
