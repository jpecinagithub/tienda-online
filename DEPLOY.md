# Deploy en Railway - Tienda Online

## Prerrequisitos

- Cuenta en [Railway.app](https://railway.app)
- Tu repositorio GitHub con el código

---

## Paso 1: Preparar el Código (Ya hecho)

El proyecto ya está preparado con:
- Backend en carpeta `/backend`
- Frontend en carpeta `/frontend` con Vite + React + Tailwind

---

## Paso 2: Subir a GitHub

Si no has hecho push aún:

```bash
cd C:\Users\HP\Documents\GiithubREPOSITORIES\tienda-online

git add .
git commit -m "Prepare for deploy"

# Push a tu repositorio
git push origin main
```

---

## Paso 3: Crear Proyecto en Railway

1. Ve a [Railway](https://railway.app)
2. Click **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza GitHub y selecciona tu repositorio

---

## Paso 4: Crear Base de Datos MySQL

1. En tu proyecto Railway, click **"New"**
2. Selecciona **"MySQL"**
3. Click **"Add Database"**
4. Espera a que se aprovisione

---

## Paso 5: Deploy del Backend

### 5.1 Crear servicio Node

1. Click **"New"** → **"Node.js"**
2. Selecciona tu repositorio
3. En **Root Directory** escribe: `backend`
4. Click **"Deploy"**

### 5.2 Configurar variables de entorno

En la sección **Variables** del servicio backend, añade:

```
PORT=3001
NODE_ENV=production
DB_HOST=Tu_MYSQL_HOST
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Tu_MYSQL_PASSWORD
DB_NAME=tienda_online
JWT_SECRET=una_clave_secreta_muy_larga_123456789
JWT_EXPIRES_IN=7d
```

**Para obtener las credenciales de MySQL:**
1. Click en el servicio MySQL
2. Click en **"Connection"** 
3. Copia los valores de Host, User, Password

### 5.3 Ejecutar SQL

1. Click en MySQL → **"MySQL Console"** o **"Shell"**
2. Ejecuta:

```sql
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS tienda_online;
USE tienda_online;

-- Luego copia y ejecuta el contenido de:
-- database.sql
-- seed.sql
-- update_images.sql
```

---

## Paso 6: Deploy del Frontend

### 6.1 Crear servicio Static

1. Click **"New"** → **"Static Site"**
2. Selecciona tu repositorio
3. Root Directory: `frontend`
4. Build Command: `npm run build`
5. Output Directory: `dist`

### 6.2 Configurar variable de entorno

En el servicio de frontend, añade:

```
VITE_API_URL=https://tu-backend-production.up.railway.app
```

**Reemplaza con la URL real de tu backend (la obtienes del paso 5)**

---

## Paso 7: Probar

1. Obtén la URL del frontend de Railway
2. Prueba el registro/login
3. Verifica que las imágenes cargan
4. Prueba hacer un pedido

---

## URLs de Ejemplo

```
Frontend:  https://tienda-online-frontend.up.railway.app
Backend:   https://tienda-online-backend.up.railway.app
API:       https://tienda-online-backend.up.railway.app/api
```

---

## Solución de Problemas

### Error "Cannot read property of undefined"
- Revisa las variables de entorno en Railway

### Error de conexión a MySQL
- Verifica que DB_HOST sea correcto
- Asegúrate de que MySQL esté disponible

### Imágenes no cargan
- Verifica que las URLs de imágenes en la BDD son válidas
- Las imágenes de picsum.photos deberían funcionar

### CORS errors
- El backend ya tiene CORS configurado
- Si hay problemas, verifica que el frontend apunta a la URL correcta del API

---

## Estructura de Archivos Esperada

```
tienda-online/
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
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── database.sql
├── seed.sql
└── update_images.sql
```
