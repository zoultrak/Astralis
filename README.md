# Astralis — Sistema de Gestión de Transporte

abrir terminal y correr

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

/home/einzieg/Descargas/Astralis-completo/astralis/src/app

```

```
astralis
├─ .env
├─ .env.example
├─ .next
│  └─ dev
│     ├─ build
│     │  ├─ chunks
│     │  │  ├─ [root-of-the-server]__51225daf._.js
│     │  │  ├─ [root-of-the-server]__51225daf._.js.map
│     │  │  ├─ [root-of-the-server]__974941ed._.js
│     │  │  ├─ [root-of-the-server]__974941ed._.js.map
│     │  │  ├─ [turbopack-node]_transforms_postcss_ts_6920245c._.js
│     │  │  ├─ [turbopack-node]_transforms_postcss_ts_6920245c._.js.map
│     │  │  ├─ [turbopack]_runtime.js
│     │  │  └─ [turbopack]_runtime.js.map
│     │  ├─ package.json
│     │  ├─ postcss.js
│     │  └─ postcss.js.map
│     ├─ build-manifest.json
│     ├─ cache
│     │  ├─ .rscinfo
│     │  ├─ next-devtools-config.json
│     │  └─ turbopack
│     │     └─ 0c06f068
│     │        ├─ 00000002.sst
│     │        ├─ 00000003.sst
│     │        ├─ 00000004.sst
│     │        ├─ 00000005.sst
│     │        ├─ 00000006.meta
│     │        ├─ 00000007.meta
│     │        ├─ 00000009.meta
│     │        ├─ 00000010.meta
│     │        ├─ 00000011.sst
│     │        ├─ 00000013.sst
│     │        ├─ 00000014.sst
│     │        ├─ 00000015.sst
│     │        ├─ 00000016.meta
│     │        ├─ 00000018.meta
│     │        ├─ 00000019.meta
│     │        ├─ 00000020.meta
│     │        ├─ 00000022.sst
│     │        ├─ 00000023.sst
│     │        ├─ 00000024.sst
│     │        ├─ 00000025.sst
│     │        ├─ 00000026.meta
│     │        ├─ 00000027.meta
│     │        ├─ 00000029.meta
│     │        ├─ 00000030.meta
│     │        ├─ 00000032.sst
│     │        ├─ 00000033.sst
│     │        ├─ 00000034.meta
│     │        ├─ 00000036.meta
│     │        ├─ 00000041.sst
│     │        ├─ 00000042.sst
│     │        ├─ 00000043.sst
│     │        ├─ 00000044.sst
│     │        ├─ 00000045.meta
│     │        ├─ 00000046.meta
│     │        ├─ 00000047.meta
│     │        ├─ 00000049.meta
│     │        ├─ 00000050.sst
│     │        ├─ 00000052.sst
│     │        ├─ 00000053.meta
│     │        ├─ 00000054.meta
│     │        ├─ 00000056.sst
│     │        ├─ 00000058.sst
│     │        ├─ 00000059.meta
│     │        ├─ 00000060.meta
│     │        ├─ 00000066.sst
│     │        ├─ 00000067.sst
│     │        ├─ 00000068.sst
│     │        ├─ 00000069.sst
│     │        ├─ 00000070.meta
│     │        ├─ 00000071.meta
│     │        ├─ 00000072.meta
│     │        ├─ 00000074.meta
│     │        ├─ 00000080.sst
│     │        ├─ 00000081.sst
│     │        ├─ 00000082.sst
│     │        ├─ 00000083.sst
│     │        ├─ 00000084.meta
│     │        ├─ 00000086.meta
│     │        ├─ 00000087.meta
│     │        ├─ 00000088.meta
│     │        ├─ 00000090.sst
│     │        ├─ 00000091.sst
│     │        ├─ 00000092.meta
│     │        ├─ 00000094.meta
│     │        ├─ 00000096.sst
│     │        ├─ 00000097.sst
│     │        ├─ 00000098.sst
│     │        ├─ 00000099.sst
│     │        ├─ 00000100.meta
│     │        ├─ 00000101.meta
│     │        ├─ 00000102.meta
│     │        ├─ 00000104.meta
│     │        ├─ 00000106.sst
│     │        ├─ 00000107.sst
│     │        ├─ 00000108.sst
│     │        ├─ 00000109.sst
│     │        ├─ 00000110.meta
│     │        ├─ 00000111.meta
│     │        ├─ 00000113.meta
│     │        ├─ 00000114.meta
│     │        ├─ 00000116.sst
│     │        ├─ 00000117.sst
│     │        ├─ 00000118.sst
│     │        ├─ 00000119.sst
│     │        ├─ 00000120.meta
│     │        ├─ 00000122.meta
│     │        ├─ 00000123.meta
│     │        ├─ 00000124.meta
│     │        ├─ 00000129.sst
│     │        ├─ 00000130.sst
│     │        ├─ 00000131.sst
│     │        ├─ 00000132.sst
│     │        ├─ 00000133.meta
│     │        ├─ 00000134.meta
│     │        ├─ 00000135.meta
│     │        ├─ 00000137.meta
│     │        ├─ 00000138.sst
│     │        ├─ 00000139.sst
│     │        ├─ 00000140.sst
│     │        ├─ 00000141.meta
│     │        ├─ 00000142.del
│     │        ├─ 00000143.sst
│     │        ├─ 00000144.sst
│     │        ├─ 00000145.sst
│     │        ├─ 00000146.sst
│     │        ├─ 00000147.sst
│     │        ├─ 00000148.meta
│     │        ├─ 00000149.meta
│     │        ├─ 00000150.meta
│     │        ├─ 00000151.meta
│     │        ├─ 00000152.meta
│     │        ├─ 00000153.sst
│     │        ├─ 00000154.sst
│     │        ├─ 00000155.sst
│     │        ├─ 00000156.meta
│     │        ├─ 00000157.meta
│     │        ├─ 00000158.meta
│     │        ├─ 00000159.sst
│     │        ├─ 00000160.sst
│     │        ├─ 00000161.sst
│     │        ├─ 00000162.meta
│     │        ├─ 00000163.meta
│     │        ├─ 00000164.meta
│     │        ├─ 00000165.sst
│     │        ├─ 00000166.sst
│     │        ├─ 00000167.sst
│     │        ├─ 00000168.meta
│     │        ├─ 00000169.meta
│     │        ├─ 00000170.meta
│     │        ├─ 00000171.sst
│     │        ├─ 00000172.sst
│     │        ├─ 00000173.sst
│     │        ├─ 00000174.meta
│     │        ├─ 00000175.meta
│     │        ├─ 00000176.meta
│     │        ├─ 00000177.sst
│     │        ├─ 00000178.sst
│     │        ├─ 00000179.sst
│     │        ├─ 00000180.meta
│     │        ├─ 00000181.meta
│     │        ├─ 00000182.meta
│     │        ├─ CURRENT
│     │        └─ LOG
│     ├─ fallback-build-manifest.json
│     ├─ lock
│     ├─ logs
│     │  └─ next-development.log
│     ├─ package.json
│     ├─ prerender-manifest.json
│     ├─ routes-manifest.json
│     ├─ server
│     │  ├─ app
│     │  │  ├─ (app)
│     │  │  │  ├─ andenes
│     │  │  │  │  ├─ page
│     │  │  │  │  │  ├─ app-paths-manifest.json
│     │  │  │  │  │  ├─ build-manifest.json
│     │  │  │  │  │  ├─ next-font-manifest.json
│     │  │  │  │  │  ├─ react-loadable-manifest.json
│     │  │  │  │  │  └─ server-reference-manifest.json
│     │  │  │  │  ├─ page.js
│     │  │  │  │  ├─ page.js.map
│     │  │  │  │  └─ page_client-reference-manifest.js
│     │  │  │  ├─ autobuses
│     │  │  │  │  ├─ page
│     │  │  │  │  │  ├─ app-paths-manifest.json
│     │  │  │  │  │  ├─ build-manifest.json
│     │  │  │  │  │  ├─ next-font-manifest.json
│     │  │  │  │  │  ├─ react-loadable-manifest.json
│     │  │  │  │  │  └─ server-reference-manifest.json
│     │  │  │  │  ├─ page.js
│     │  │  │  │  ├─ page.js.map
│     │  │  │  │  └─ page_client-reference-manifest.js
│     │  │  │  ├─ boletos
│     │  │  │  │  ├─ page
│     │  │  │  │  │  ├─ app-paths-manifest.json
│     │  │  │  │  │  ├─ build-manifest.json
│     │  │  │  │  │  ├─ next-font-manifest.json
│     │  │  │  │  │  ├─ react-loadable-manifest.json
│     │  │  │  │  │  └─ server-reference-manifest.json
│     │  │  │  │  ├─ page.js
│     │  │  │  │  ├─ page.js.map
│     │  │  │  │  └─ page_client-reference-manifest.js
│     │  │  │  ├─ conductores
│     │  │  │  │  ├─ page
│     │  │  │  │  │  ├─ app-paths-manifest.json
│     │  │  │  │  │  ├─ build-manifest.json
│     │  │  │  │  │  ├─ next-font-manifest.json
│     │  │  │  │  │  ├─ react-loadable-manifest.json
│     │  │  │  │  │  └─ server-reference-manifest.json
│     │  │  │  │  ├─ page.js
│     │  │  │  │  ├─ page.js.map
│     │  │  │  │  └─ page_client-reference-manifest.js
│     │  │  │  ├─ dashboard
│     │  │  │  │  ├─ page
│     │  │  │  │  │  ├─ app-paths-manifest.json
│     │  │  │  │  │  ├─ build-manifest.json
│     │  │  │  │  │  ├─ next-font-manifest.json
│     │  │  │  │  │  ├─ react-loadable-manifest.json
│     │  │  │  │  │  └─ server-reference-manifest.json
│     │  │  │  │  ├─ page.js
│     │  │  │  │  ├─ page.js.map
│     │  │  │  │  └─ page_client-reference-manifest.js
│     │  │  │  ├─ horarios
│     │  │  │  │  ├─ page
│     │  │  │  │  │  ├─ app-paths-manifest.json
│     │  │  │  │  │  ├─ build-manifest.json
│     │  │  │  │  │  ├─ next-font-manifest.json
│     │  │  │  │  │  ├─ react-loadable-manifest.json
│     │  │  │  │  │  └─ server-reference-manifest.json
│     │  │  │  │  ├─ page.js
│     │  │  │  │  ├─ page.js.map
│     │  │  │  │  └─ page_client-reference-manifest.js
│     │  │  │  ├─ rutas
│     │  │  │  │  ├─ page
│     │  │  │  │  │  ├─ app-paths-manifest.json
│     │  │  │  │  │  ├─ build-manifest.json
│     │  │  │  │  │  ├─ next-font-manifest.json
│     │  │  │  │  │  ├─ react-loadable-manifest.json
│     │  │  │  │  │  └─ server-reference-manifest.json
│     │  │  │  │  ├─ page.js
│     │  │  │  │  ├─ page.js.map
│     │  │  │  │  └─ page_client-reference-manifest.js
│     │  │  │  └─ usuarios
│     │  │  │     ├─ page
│     │  │  │     │  ├─ app-paths-manifest.json
│     │  │  │     │  ├─ build-manifest.json
│     │  │  │     │  ├─ next-font-manifest.json
│     │  │  │     │  ├─ react-loadable-manifest.json
│     │  │  │     │  └─ server-reference-manifest.json
│     │  │  │     ├─ page.js
│     │  │  │     ├─ page.js.map
│     │  │  │     └─ page_client-reference-manifest.js
│     │  │  ├─ api
│     │  │  │  ├─ andenes
│     │  │  │  │  ├─ route
│     │  │  │  │  │  ├─ app-paths-manifest.json
│     │  │  │  │  │  ├─ build-manifest.json
│     │  │  │  │  │  └─ server-reference-manifest.json
│     │  │  │  │  ├─ route.js
│     │  │  │  │  ├─ route.js.map
│     │  │  │  │  └─ route_client-reference-manifest.js
│     │  │  │  ├─ auth
│     │  │  │  │  └─ [...nextauth]
│     │  │  │  │     ├─ route
│     │  │  │  │     │  ├─ app-paths-manifest.json
│     │  │  │  │     │  ├─ build-manifest.json
│     │  │  │  │     │  └─ server-reference-manifest.json
│     │  │  │  │     ├─ route.js
│     │  │  │  │     ├─ route.js.map
│     │  │  │  │     └─ route_client-reference-manifest.js
│     │  │  │  ├─ autobuses
│     │  │  │  │  ├─ route
│     │  │  │  │  │  ├─ app-paths-manifest.json
│     │  │  │  │  │  ├─ build-manifest.json
│     │  │  │  │  │  └─ server-reference-manifest.json
│     │  │  │  │  ├─ route.js
│     │  │  │  │  ├─ route.js.map
│     │  │  │  │  └─ route_client-reference-manifest.js
│     │  │  │  ├─ conductores
│     │  │  │  │  ├─ route
│     │  │  │  │  │  ├─ app-paths-manifest.json
│     │  │  │  │  │  ├─ build-manifest.json
│     │  │  │  │  │  └─ server-reference-manifest.json
│     │  │  │  │  ├─ route.js
│     │  │  │  │  ├─ route.js.map
│     │  │  │  │  └─ route_client-reference-manifest.js
│     │  │  │  ├─ horarios
│     │  │  │  │  ├─ route
│     │  │  │  │  │  ├─ app-paths-manifest.json
│     │  │  │  │  │  ├─ build-manifest.json
│     │  │  │  │  │  └─ server-reference-manifest.json
│     │  │  │  │  ├─ route.js
│     │  │  │  │  ├─ route.js.map
│     │  │  │  │  └─ route_client-reference-manifest.js
│     │  │  │  ├─ rutas
│     │  │  │  │  ├─ route
│     │  │  │  │  │  ├─ app-paths-manifest.json
│     │  │  │  │  │  ├─ build-manifest.json
│     │  │  │  │  │  └─ server-reference-manifest.json
│     │  │  │  │  ├─ route.js
│     │  │  │  │  ├─ route.js.map
│     │  │  │  │  └─ route_client-reference-manifest.js
│     │  │  │  └─ usuarios
│     │  │  │     ├─ roles
│     │  │  │     │  ├─ route
│     │  │  │     │  │  ├─ app-paths-manifest.json
│     │  │  │     │  │  ├─ build-manifest.json
│     │  │  │     │  │  └─ server-reference-manifest.json
│     │  │  │     │  ├─ route.js
│     │  │  │     │  ├─ route.js.map
│     │  │  │     │  └─ route_client-reference-manifest.js
│     │  │  │     ├─ route
│     │  │  │     │  ├─ app-paths-manifest.json
│     │  │  │     │  ├─ build-manifest.json
│     │  │  │     │  └─ server-reference-manifest.json
│     │  │  │     ├─ route.js
│     │  │  │     ├─ route.js.map
│     │  │  │     └─ route_client-reference-manifest.js
│     │  │  ├─ login
│     │  │  │  ├─ page
│     │  │  │  │  ├─ app-paths-manifest.json
│     │  │  │  │  ├─ build-manifest.json
│     │  │  │  │  ├─ next-font-manifest.json
│     │  │  │  │  ├─ react-loadable-manifest.json
│     │  │  │  │  └─ server-reference-manifest.json
│     │  │  │  ├─ page.js
│     │  │  │  ├─ page.js.map
│     │  │  │  └─ page_client-reference-manifest.js
│     │  │  ├─ page
│     │  │  │  ├─ app-paths-manifest.json
│     │  │  │  ├─ build-manifest.json
│     │  │  │  ├─ next-font-manifest.json
│     │  │  │  ├─ react-loadable-manifest.json
│     │  │  │  └─ server-reference-manifest.json
│     │  │  ├─ page.js
│     │  │  ├─ page.js.map
│     │  │  └─ page_client-reference-manifest.js
│     │  ├─ app-paths-manifest.json
│     │  ├─ chunks
│     │  │  ├─ [root-of-the-server]__5187b91b._.js
│     │  │  ├─ [root-of-the-server]__5187b91b._.js.map
│     │  │  ├─ [root-of-the-server]__6fd29a53._.js
│     │  │  ├─ [root-of-the-server]__6fd29a53._.js.map
│     │  │  ├─ [root-of-the-server]__7ff02b67._.js
│     │  │  ├─ [root-of-the-server]__7ff02b67._.js.map
│     │  │  ├─ [root-of-the-server]__85182ec5._.js
│     │  │  ├─ [root-of-the-server]__85182ec5._.js.map
│     │  │  ├─ [root-of-the-server]__9492c03c._.js
│     │  │  ├─ [root-of-the-server]__9492c03c._.js.map
│     │  │  ├─ [root-of-the-server]__95c04bee._.js
│     │  │  ├─ [root-of-the-server]__95c04bee._.js.map
│     │  │  ├─ [root-of-the-server]__98304aa0._.js
│     │  │  ├─ [root-of-the-server]__98304aa0._.js.map
│     │  │  ├─ [root-of-the-server]__9aaf631b._.js
│     │  │  ├─ [root-of-the-server]__9aaf631b._.js.map
│     │  │  ├─ [root-of-the-server]__bd5248eb._.js
│     │  │  ├─ [root-of-the-server]__bd5248eb._.js.map
│     │  │  ├─ [root-of-the-server]__dee4d3f9._.js
│     │  │  ├─ [root-of-the-server]__dee4d3f9._.js.map
│     │  │  ├─ [root-of-the-server]__e10cbcc5._.js
│     │  │  ├─ [root-of-the-server]__e10cbcc5._.js.map
│     │  │  ├─ [root-of-the-server]__e9c376df._.js
│     │  │  ├─ [root-of-the-server]__e9c376df._.js.map
│     │  │  ├─ [turbopack]_runtime.js
│     │  │  ├─ [turbopack]_runtime.js.map
│     │  │  ├─ _next-internal_server_app_api_andenes_route_actions_663c5c39.js
│     │  │  ├─ _next-internal_server_app_api_andenes_route_actions_663c5c39.js.map
│     │  │  ├─ _next-internal_server_app_api_auth_[___nextauth]_route_actions_1c865db8.js
│     │  │  ├─ _next-internal_server_app_api_auth_[___nextauth]_route_actions_1c865db8.js.map
│     │  │  ├─ _next-internal_server_app_api_autobuses_route_actions_25d8ed42.js
│     │  │  ├─ _next-internal_server_app_api_autobuses_route_actions_25d8ed42.js.map
│     │  │  ├─ _next-internal_server_app_api_conductores_route_actions_20ffd429.js
│     │  │  ├─ _next-internal_server_app_api_conductores_route_actions_20ffd429.js.map
│     │  │  ├─ _next-internal_server_app_api_horarios_route_actions_dbf37140.js
│     │  │  ├─ _next-internal_server_app_api_horarios_route_actions_dbf37140.js.map
│     │  │  ├─ _next-internal_server_app_api_rutas_route_actions_9be5b665.js
│     │  │  ├─ _next-internal_server_app_api_rutas_route_actions_9be5b665.js.map
│     │  │  ├─ _next-internal_server_app_api_usuarios_roles_route_actions_f560517c.js
│     │  │  ├─ _next-internal_server_app_api_usuarios_roles_route_actions_f560517c.js.map
│     │  │  ├─ _next-internal_server_app_api_usuarios_route_actions_463c42ec.js
│     │  │  ├─ _next-internal_server_app_api_usuarios_route_actions_463c42ec.js.map
│     │  │  └─ ssr
│     │  │     ├─ [externals]__7f148858._.js
│     │  │     ├─ [externals]__7f148858._.js.map
│     │  │     ├─ [externals]__e6a4d965._.js
│     │  │     ├─ [externals]__e6a4d965._.js.map
│     │  │     ├─ [externals]_next_dist_1aaf5479._.js
│     │  │     ├─ [externals]_next_dist_1aaf5479._.js.map
│     │  │     ├─ [externals]_next_dist_shared_lib_no-fallback-error_external_59b92b38.js
│     │  │     ├─ [externals]_next_dist_shared_lib_no-fallback-error_external_59b92b38.js.map
│     │  │     ├─ [root-of-the-server]__0a75fbd8._.js
│     │  │     ├─ [root-of-the-server]__0a75fbd8._.js.map
│     │  │     ├─ [root-of-the-server]__2541b344._.js
│     │  │     ├─ [root-of-the-server]__2541b344._.js.map
│     │  │     ├─ [root-of-the-server]__293895f6._.js
│     │  │     ├─ [root-of-the-server]__293895f6._.js.map
│     │  │     ├─ [root-of-the-server]__6b3dcf36._.js
│     │  │     ├─ [root-of-the-server]__6b3dcf36._.js.map
│     │  │     ├─ [root-of-the-server]__6b4098c2._.js
│     │  │     ├─ [root-of-the-server]__6b4098c2._.js.map
│     │  │     ├─ [root-of-the-server]__6e2fc687._.js
│     │  │     ├─ [root-of-the-server]__6e2fc687._.js.map
│     │  │     ├─ [root-of-the-server]__70a73b34._.js
│     │  │     ├─ [root-of-the-server]__70a73b34._.js.map
│     │  │     ├─ [root-of-the-server]__7ba2e777._.js
│     │  │     ├─ [root-of-the-server]__7ba2e777._.js.map
│     │  │     ├─ [root-of-the-server]__8dc8c634._.js
│     │  │     ├─ [root-of-the-server]__8dc8c634._.js.map
│     │  │     ├─ [root-of-the-server]__8e253e4d._.js
│     │  │     ├─ [root-of-the-server]__8e253e4d._.js.map
│     │  │     ├─ [root-of-the-server]__965ad0cc._.js
│     │  │     ├─ [root-of-the-server]__965ad0cc._.js.map
│     │  │     ├─ [root-of-the-server]__a5c27348._.js
│     │  │     ├─ [root-of-the-server]__a5c27348._.js.map
│     │  │     ├─ [root-of-the-server]__c5c0e1c5._.js
│     │  │     ├─ [root-of-the-server]__c5c0e1c5._.js.map
│     │  │     ├─ [root-of-the-server]__c6c4450e._.js
│     │  │     ├─ [root-of-the-server]__c6c4450e._.js.map
│     │  │     ├─ [root-of-the-server]__c8882328._.js
│     │  │     ├─ [root-of-the-server]__c8882328._.js.map
│     │  │     ├─ [root-of-the-server]__d06a6ecd._.js
│     │  │     ├─ [root-of-the-server]__d06a6ecd._.js.map
│     │  │     ├─ [turbopack]_runtime.js
│     │  │     ├─ [turbopack]_runtime.js.map
│     │  │     ├─ _ce9a95c8._.js
│     │  │     ├─ _ce9a95c8._.js.map
│     │  │     ├─ _next-internal_server_app_(app)_andenes_page_actions_2c86e56f.js
│     │  │     ├─ _next-internal_server_app_(app)_andenes_page_actions_2c86e56f.js.map
│     │  │     ├─ _next-internal_server_app_(app)_autobuses_page_actions_b59c11f6.js
│     │  │     ├─ _next-internal_server_app_(app)_autobuses_page_actions_b59c11f6.js.map
│     │  │     ├─ _next-internal_server_app_(app)_boletos_page_actions_d2ef9c82.js
│     │  │     ├─ _next-internal_server_app_(app)_boletos_page_actions_d2ef9c82.js.map
│     │  │     ├─ _next-internal_server_app_(app)_conductores_page_actions_d79dee30.js
│     │  │     ├─ _next-internal_server_app_(app)_conductores_page_actions_d79dee30.js.map
│     │  │     ├─ _next-internal_server_app_(app)_dashboard_page_actions_9eeb4a04.js
│     │  │     ├─ _next-internal_server_app_(app)_dashboard_page_actions_9eeb4a04.js.map
│     │  │     ├─ _next-internal_server_app_(app)_horarios_page_actions_306a9d82.js
│     │  │     ├─ _next-internal_server_app_(app)_horarios_page_actions_306a9d82.js.map
│     │  │     ├─ _next-internal_server_app_(app)_rutas_page_actions_85eccc3f.js
│     │  │     ├─ _next-internal_server_app_(app)_rutas_page_actions_85eccc3f.js.map
│     │  │     ├─ _next-internal_server_app_(app)_usuarios_page_actions_473b5b26.js
│     │  │     ├─ _next-internal_server_app_(app)_usuarios_page_actions_473b5b26.js.map
│     │  │     ├─ _next-internal_server_app_login_page_actions_0e9aafc0.js
│     │  │     ├─ _next-internal_server_app_login_page_actions_0e9aafc0.js.map
│     │  │     ├─ _next-internal_server_app_page_actions_39d4fc33.js
│     │  │     ├─ _next-internal_server_app_page_actions_39d4fc33.js.map
│     │  │     ├─ src_1d1bbec9._.js
│     │  │     ├─ src_1d1bbec9._.js.map
│     │  │     ├─ src_1eed5d32._.js
│     │  │     ├─ src_1eed5d32._.js.map
│     │  │     ├─ src_2adfbc23._.js
│     │  │     ├─ src_2adfbc23._.js.map
│     │  │     ├─ src_2d7604b3._.js
│     │  │     ├─ src_2d7604b3._.js.map
│     │  │     ├─ src_324ea011._.js
│     │  │     ├─ src_324ea011._.js.map
│     │  │     ├─ src_bb022c96._.js
│     │  │     ├─ src_bb022c96._.js.map
│     │  │     ├─ src_components_Topbar_tsx_865895f7._.js
│     │  │     ├─ src_components_Topbar_tsx_865895f7._.js.map
│     │  │     ├─ src_e2ad3a8d._.js
│     │  │     └─ src_e2ad3a8d._.js.map
│     │  ├─ edge
│     │  │  └─ chunks
│     │  │     ├─ [root-of-the-server]__2b3f7b68._.js
│     │  │     └─ [root-of-the-server]__2b3f7b68._.js.map
│     │  ├─ interception-route-rewrite-manifest.js
│     │  ├─ middleware
│     │  │  └─ middleware-manifest.json
│     │  ├─ middleware-build-manifest.js
│     │  ├─ middleware-manifest.json
│     │  ├─ middleware.js
│     │  ├─ middleware.js.map
│     │  ├─ next-font-manifest.js
│     │  ├─ next-font-manifest.json
│     │  ├─ pages
│     │  │  ├─ _app
│     │  │  │  ├─ build-manifest.json
│     │  │  │  ├─ client-build-manifest.json
│     │  │  │  ├─ next-font-manifest.json
│     │  │  │  ├─ pages-manifest.json
│     │  │  │  └─ react-loadable-manifest.json
│     │  │  ├─ _app.js
│     │  │  ├─ _app.js.map
│     │  │  ├─ _document
│     │  │  │  ├─ next-font-manifest.json
│     │  │  │  ├─ pages-manifest.json
│     │  │  │  └─ react-loadable-manifest.json
│     │  │  ├─ _document.js
│     │  │  ├─ _document.js.map
│     │  │  ├─ _error
│     │  │  │  ├─ build-manifest.json
│     │  │  │  ├─ client-build-manifest.json
│     │  │  │  ├─ next-font-manifest.json
│     │  │  │  ├─ pages-manifest.json
│     │  │  │  └─ react-loadable-manifest.json
│     │  │  ├─ _error.js
│     │  │  └─ _error.js.map
│     │  ├─ pages-manifest.json
│     │  ├─ server-reference-manifest.js
│     │  └─ server-reference-manifest.json
│     ├─ static
│     │  ├─ chunks
│     │  │  ├─ [next]_entry_page-loader_ts_43b523b5._.js
│     │  │  ├─ [next]_entry_page-loader_ts_43b523b5._.js.map
│     │  │  ├─ [next]_entry_page-loader_ts_742e4b53._.js
│     │  │  ├─ [next]_entry_page-loader_ts_742e4b53._.js.map
│     │  │  ├─ [root-of-the-server]__092393de._.js
│     │  │  ├─ [root-of-the-server]__092393de._.js.map
│     │  │  ├─ [root-of-the-server]__45f039c3._.js
│     │  │  ├─ [root-of-the-server]__45f039c3._.js.map
│     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_956a0d3a._.js
│     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_956a0d3a._.js.map
│     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_c7192189._.js
│     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_c8c997ce._.js
│     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_c8c997ce._.js.map
│     │  │  ├─ _23a915ee._.js.map
│     │  │  ├─ _991c5b5f._.js
│     │  │  ├─ _991c5b5f._.js.map
│     │  │  ├─ _a0ff3932._.js
│     │  │  ├─ _e19715ee._.js
│     │  │  ├─ _e19715ee._.js.map
│     │  │  ├─ pages
│     │  │  │  ├─ _app.js
│     │  │  │  └─ _error.js
│     │  │  ├─ pages__app_0fce199e._.js.map
│     │  │  ├─ pages__app_2da965e7._.js
│     │  │  ├─ pages__error_2da965e7._.js
│     │  │  ├─ pages__error_af01c4e3._.js.map
│     │  │  ├─ src_22ee34b0._.js
│     │  │  ├─ src_22ee34b0._.js.map
│     │  │  ├─ src_2eec18f9._.js
│     │  │  ├─ src_2eec18f9._.js.map
│     │  │  ├─ src_50ec3db0._.js
│     │  │  ├─ src_50ec3db0._.js.map
│     │  │  ├─ src_5fac3058._.js
│     │  │  ├─ src_5fac3058._.js.map
│     │  │  ├─ src_7a87c36b._.js
│     │  │  ├─ src_7a87c36b._.js.map
│     │  │  ├─ src_app_(app)_andenes_page_tsx_a405c59f._.js
│     │  │  ├─ src_app_(app)_autobuses_page_tsx_a405c59f._.js
│     │  │  ├─ src_app_(app)_boletos_page_tsx_a405c59f._.js
│     │  │  ├─ src_app_(app)_conductores_page_tsx_a405c59f._.js
│     │  │  ├─ src_app_(app)_dashboard_page_tsx_a405c59f._.js
│     │  │  ├─ src_app_(app)_horarios_page_tsx_a405c59f._.js
│     │  │  ├─ src_app_(app)_layout_tsx_8e9f1618._.js
│     │  │  ├─ src_app_(app)_rutas_page_tsx_a405c59f._.js
│     │  │  ├─ src_app_(app)_usuarios_page_tsx_a405c59f._.js
│     │  │  ├─ src_app_globals_91e4631d.css
│     │  │  ├─ src_app_globals_91e4631d.css.map
│     │  │  ├─ src_app_layout_tsx_1cf6b850._.js
│     │  │  ├─ src_app_login_page_tsx_8e9f1618._.js
│     │  │  ├─ src_c5fe91aa._.js
│     │  │  ├─ src_c5fe91aa._.js.map
│     │  │  ├─ src_cdbcab8c._.js
│     │  │  ├─ src_cdbcab8c._.js.map
│     │  │  ├─ src_components_Topbar_tsx_dc3ad485._.js
│     │  │  ├─ src_components_Topbar_tsx_dc3ad485._.js.map
│     │  │  ├─ turbopack-_23a915ee._.js
│     │  │  ├─ turbopack-pages__app_0fce199e._.js
│     │  │  └─ turbopack-pages__error_af01c4e3._.js
│     │  └─ development
│     │     ├─ _buildManifest.js
│     │     ├─ _clientMiddlewareManifest.json
│     │     └─ _ssgManifest.js
│     ├─ trace
│     └─ types
│        ├─ cache-life.d.ts
│        ├─ routes.d.ts
│        └─ validator.ts
├─ README.md
├─ eslint.config.mjs
├─ next-env.d.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ playwright.config.ts
├─ postcss.config.mjs
├─ prisma
│  ├─ migrations
│  │  ├─ 20260322184752_init
│  │  │  └─ migration.sql
│  │  ├─ 20260322213629_add_bloqueado_hasta
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  ├─ schema.prisma
│  └─ seeds
│     └─ seed.ts
├─ prisma.config.ts
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ setup.sh
├─ src
│  ├─ app
│  │  ├─ (app)
│  │  │  ├─ andenes
│  │  │  │  ├─ AndenesTable.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ autobuses
│  │  │  │  ├─ AutobusesTable.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ boletos
│  │  │  │  ├─ BoletosPos.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ conductores
│  │  │  │  ├─ ConductoresTable.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ dashboard
│  │  │  │  └─ page.tsx
│  │  │  ├─ horarios
│  │  │  │  ├─ HorariosTable.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ rutas
│  │  │  │  ├─ RutasTable.tsx
│  │  │  │  └─ page.tsx
│  │  │  └─ usuarios
│  │  │     ├─ UsuariosTable.tsx
│  │  │     └─ page.tsx
│  │  ├─ api
│  │  │  ├─ andenes
│  │  │  │  ├─ [id]
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ auth
│  │  │  │  └─ [...nextauth]
│  │  │  │     └─ route.ts
│  │  │  ├─ autobuses
│  │  │  │  ├─ [id]
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ boletos
│  │  │  │  └─ asientos
│  │  │  │     └─ route.ts
│  │  │  ├─ conductores
│  │  │  │  ├─ [id]
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ horarios
│  │  │  │  ├─ [id]
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ rutas
│  │  │  │  ├─ [id]
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ usuarios
│  │  │  │  ├─ [id]
│  │  │  │  │  ├─ desbloquear
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ roles
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  └─ ventas
│  │  │     └─ route.ts
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ auth.ts
│  ├─ components
│  │  ├─ SessionProvider.tsx
│  │  ├─ Sidebar.tsx
│  │  └─ Topbar.tsx
│  ├─ hooks
│  ├─ lib
│  │  └─ prisma.ts
│  ├─ models
│  ├─ proxy.ts
│  ├─ services
│  └─ types
│     └─ next-auth.d.ts
├─ tests
│  └─ home.spec.ts
└─ tsconfig.json

```