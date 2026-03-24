# Astralis — Sistema de Gestión de Transporte

abrir terminal y correr dentro del proyecto

cd ~/Descargas/astralis
chmod +x setup.sh
./setup.sh

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Prisma** + **MySQL**
- **NextAuth v5** (JWT, Credentials)
- **Tailwind CSS v4**

## Módulos implementados

| CU  | Módulo                        | Ruta           | API                                         |
| --- | ----------------------------- | -------------- | ------------------------------------------- |
| CU1 | Seguridad / Login             | `/login`       | `/api/auth`, `/api/usuarios`                |
| CU1 | Gestión de Usuarios           | `/usuarios`    | `/api/usuarios/[id]`                        |
| CU2 | Administración de Rutas       | `/rutas`       | `/api/rutas`, `/api/rutas/[id]`             |
| CU3 | Programación de Horarios      | `/horarios`    | `/api/horarios`, `/api/horarios/[id]`       |
| CU4 | Venta de Boletos (POS)        | `/boletos`     | `/api/ventas`, `/api/boletos/asientos`      |
| CU5 | Gestión de Flota              | `/autobuses`   | `/api/autobuses`, `/api/autobuses/[id]`     |
| CU6 | Administración de Conductores | `/conductores` | `/api/conductores`, `/api/conductores/[id]` |
| —   | Control de Andenes            | `/andenes`     | `/api/andenes`, `/api/andenes/[id]`         |
| —   | Dashboard                     | `/dashboard`   | —                                           |

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar DATABASE_URL y AUTH_SECRET

# 3. Migrar base de datos
npx prisma migrate dev

# 4. Cargar datos de prueba
npm run prisma:seed

# 5. Iniciar servidor
npm run dev
```

## Variables de entorno (.env)

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/astralis"
AUTH_SECRET="cambia-esto-por-un-secreto-seguro-de-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

## Credenciales de prueba

```
Email:    admin@astralis.mx
Password: admin1234
```

```


```
