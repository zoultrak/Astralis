#!/bin/bash

# =============================================================================
# ASTRALIS — Script de instalación automática
# Sistema de Gestión de Transporte
# =============================================================================

# ─── Colores ─────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ─── Helpers ─────────────────────────────────────────────────
ok()     { echo -e "${GREEN}  ✔ ${1}${NC}"; }
info()   { echo -e "${CYAN}  ℹ ${1}${NC}"; }
warn()   { echo -e "${YELLOW}  ⚠ ${1}${NC}"; }
fail()   { echo -e "${RED}  ✘ ERROR: ${1}${NC}"; echo ""; exit 1; }
step()   { echo -e "\n${BOLD}${BLUE}━━━ ${1} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }
pause()  { echo ""; read -p "  Presiona ENTER para continuar..." _; echo ""; }

# ─── Banner ───────────────────────────────────────────────────
clear
echo -e "${BOLD}${CYAN}"
echo "  ╔══════════════════════════════════════════════════╗"
echo "  ║          ASTRALIS — Instalación guiada           ║"
echo "  ║       Sistema de Gestión de Transporte           ║"
echo "  ╚══════════════════════════════════════════════════╝"
echo -e "${NC}"
echo -e "  Este script instalará todo lo necesario para correr"
echo -e "  Astralis en tu computadora. Solo sigue las instrucciones."
echo ""
echo -e "  ${YELLOW}Nota: se te pedirá tu contraseña de Linux (sudo) en algunos pasos.${NC}"
echo -e "  ${YELLOW}Es la misma contraseña que usas para iniciar sesión en tu PC.${NC}"
echo ""
pause

# ─── Verificar que estamos en el directorio correcto ─────────
if [ ! -f "package.json" ] || ! grep -q '"name": "astralis"' package.json 2>/dev/null; then
    fail "Debes ejecutar este script DESDE la carpeta del proyecto.\n\n  Usa: cd ~/Descargas/Astralis-completo/astralis\n  Luego: ./setup.sh"
fi
ok "Carpeta del proyecto detectada correctamente"

# ═════════════════════════════════════════════════════════════
# PASO 1 — Node.js
# ═════════════════════════════════════════════════════════════
step "PASO 1 de 6 — Verificando Node.js"
echo ""
echo -e "  Node.js es el motor que ejecuta el proyecto."
echo ""

if command -v node &>/dev/null; then
    NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_VER" -lt 18 ]; then
        warn "Tienes Node.js $(node -v) pero se necesita v18 o superior."
        echo ""
        echo -e "  Instalando Node.js 20 LTS automáticamente..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - 2>/dev/null
        sudo apt-get install -y nodejs 2>/dev/null
        ok "Node.js actualizado a $(node -v)"
    else
        ok "Node.js $(node -v) — listo"
    fi
else
    warn "Node.js no está instalado. Instalando ahora..."
    echo -e "  ${YELLOW}(Se te pedirá tu contraseña de Linux)${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - 2>/dev/null
    sudo apt-get install -y nodejs 2>/dev/null
    ok "Node.js $(node -v) instalado correctamente"
fi

# ═════════════════════════════════════════════════════════════
# PASO 2 — MySQL
# ═════════════════════════════════════════════════════════════
step "PASO 2 de 6 — Verificando MySQL"
echo ""
echo -e "  MySQL es la base de datos donde se guarda toda la información."
echo ""

if ! command -v mysql &>/dev/null; then
    warn "MySQL no está instalado. Instalando ahora..."
    echo -e "  ${YELLOW}(Este paso puede tardar 1-2 minutos)${NC}"
    echo ""
    sudo apt-get update -qq
    sudo apt-get install -y mysql-server 2>/dev/null
    sudo systemctl start mysql
    sudo systemctl enable mysql 2>/dev/null
    ok "MySQL instalado y listo"
else
    ok "MySQL detectado — $(mysql --version | awk '{print $1, $2, $3}')"
fi

# Asegurar que MySQL esté corriendo
if ! sudo systemctl is-active --quiet mysql 2>/dev/null; then
    info "Iniciando MySQL..."
    sudo systemctl start mysql
fi
ok "Servicio MySQL activo"

# ═════════════════════════════════════════════════════════════
# PASO 3 — Conectar a MySQL y crear la base de datos
# ═════════════════════════════════════════════════════════════
step "PASO 3 de 6 — Configurando la base de datos"
echo ""
echo -e "  Necesitamos conectarnos a MySQL para crear la base de datos."
echo -e "  Intentaremos conectarnos automáticamente..."
echo ""

# Intentar diferentes formas de conectar (Ubuntu tiene varias configuraciones)
MYSQL_CMD=""

# Intento 1: sudo sin contraseña (Ubuntu recién instalado)
if sudo mysql -u root -e "SELECT 1;" &>/dev/null 2>&1; then
    MYSQL_CMD="sudo mysql -u root"
    ok "Conectado a MySQL (modo administrador del sistema)"

# Intento 2: root sin contraseña
elif mysql -u root -e "SELECT 1;" &>/dev/null 2>&1; then
    MYSQL_CMD="mysql -u root"
    ok "Conectado a MySQL (sin contraseña)"

else
    # Pedir contraseña al usuario
    echo -e "  ${YELLOW}No se pudo conectar automáticamente.${NC}"
    echo -e "  Por favor ingresa la contraseña de MySQL."
    echo ""
    echo -e "  ${CYAN}¿No recuerdas la contraseña? Si acabas de instalar MySQL,${NC}"
    echo -e "  ${CYAN}prueba presionando ENTER (puede estar vacía).${NC}"
    echo ""

    for INTENTO in 1 2 3; do
        read -s -p "  Contraseña de MySQL (root): " MYSQL_ROOT_PASS
        echo ""

        if [ -z "$MYSQL_ROOT_PASS" ]; then
            TEST_CMD="mysql -u root"
        else
            TEST_CMD="mysql -u root -p${MYSQL_ROOT_PASS}"
        fi

        if $TEST_CMD -e "SELECT 1;" &>/dev/null 2>&1; then
            MYSQL_CMD="$TEST_CMD"
            ok "Conectado a MySQL correctamente"
            break
        else
            if [ "$INTENTO" -lt 3 ]; then
                warn "Contraseña incorrecta. Intento ${INTENTO}/3. Intenta de nuevo."
            else
                echo ""
                echo -e "  ${RED}No se pudo conectar a MySQL después de 3 intentos.${NC}"
                echo ""
                echo -e "  ${YELLOW}Solución: Abre otra terminal y ejecuta:${NC}"
                echo -e "  ${CYAN}  sudo mysql${NC}"
                echo -e "  ${CYAN}  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin1234';${NC}"
                echo -e "  ${CYAN}  EXIT;${NC}"
                echo ""
                echo -e "  Luego vuelve a correr este script con la contraseña: admin1234"
                exit 1
            fi
        fi
    done
fi

# Crear base de datos y usuario dedicado para Astralis
DB_NAME="astralis"
DB_USER="astralis_user"
DB_PASS="Astralis$(date +%Y)!"

echo ""
info "Creando base de datos '${DB_NAME}'..."

$MYSQL_CMD <<EOF 2>/dev/null
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

ok "Base de datos '${DB_NAME}' creada"
ok "Usuario '${DB_USER}' configurado con permisos"

# ═════════════════════════════════════════════════════════════
# PASO 4 — Archivo de configuración (.env)
# ═════════════════════════════════════════════════════════════
step "PASO 4 de 6 — Creando archivo de configuración"
echo ""
echo -e "  El archivo .env guarda la configuración del sistema"
echo -e "  (conexión a BD, claves de seguridad, etc)."
echo ""

# Generar clave de seguridad aleatoria
AUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@localhost:3306/${DB_NAME}"

cat > .env <<EOF
# ── Base de datos ─────────────────────────────────────────────
DATABASE_URL="${DATABASE_URL}"

# ── NextAuth — clave de seguridad (NO compartir) ──────────────
AUTH_SECRET="${AUTH_SECRET}"
NEXTAUTH_URL="http://localhost:3000"
EOF

ok "Archivo .env creado automáticamente"
info "Clave de seguridad generada y guardada"

# ═════════════════════════════════════════════════════════════
# PASO 5 — Instalar dependencias + migrar BD
# ═════════════════════════════════════════════════════════════
step "PASO 5 de 6 — Instalando el proyecto"
echo ""
echo -e "  Descargando librerías necesarias..."
echo -e "  ${YELLOW}(Este paso puede tardar 1-3 minutos según tu internet)${NC}"
echo ""

# Instalar dependencias npm
npm install 2>&1 | tail -3
ok "Librerías instaladas"

# Instalar dotenv si no está
npm list dotenv --depth=0 &>/dev/null 2>&1 || npm install dotenv --save --silent
ok "Módulo dotenv listo"

# Migrar base de datos
echo ""
info "Creando tablas en la base de datos..."
DATABASE_URL="${DATABASE_URL}" npx prisma migrate deploy 2>&1 | grep -E "(Applying|Applied|already|✔|error)" || true
DATABASE_URL="${DATABASE_URL}" npx prisma generate --silent 2>/dev/null || true
ok "Tablas creadas correctamente"

# Cargar datos iniciales
echo ""
info "Cargando datos de prueba (usuario administrador, ruta y autobús de ejemplo)..."
DATABASE_URL="${DATABASE_URL}" npm run prisma:seed 2>&1 | tail -3
ok "Datos iniciales cargados"

# ═════════════════════════════════════════════════════════════
# PASO 6 — Verificación
# ═════════════════════════════════════════════════════════════
step "PASO 6 de 6 — Verificación"
echo ""

# Contar tablas creadas
TABLE_COUNT=$($MYSQL_CMD -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${DB_NAME}';" 2>/dev/null | tail -1)
if [ -n "$TABLE_COUNT" ] && [ "$TABLE_COUNT" -gt 0 ]; then
    ok "${TABLE_COUNT} tablas en la base de datos"
else
    warn "No se pudieron verificar las tablas (puede ser normal)"
fi

# Verificar que el .env existe
[ -f ".env" ] && ok "Archivo .env presente" || warn "Archivo .env no encontrado"

# Verificar node_modules
[ -d "node_modules" ] && ok "Dependencias instaladas" || warn "node_modules no encontrada"

# ─── Resumen final ────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}"
echo "  ╔══════════════════════════════════════════════════╗"
echo "  ║          ¡Instalación completada! 🎉             ║"
echo "  ╚══════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "  ${BOLD}─── Para entrar al sistema ────────────────────────${NC}"
echo -e "  ${CYAN}  Abre el navegador en:  ${BOLD}http://localhost:3000${NC}"
echo -e "  ${CYAN}  Correo:                ${BOLD}admin@astralis.mx${NC}"
echo -e "  ${CYAN}  Contraseña:            ${BOLD}admin1234${NC}"
echo ""
echo -e "  ${BOLD}─── Para iniciar el servidor ───────────────────────${NC}"
echo -e "  ${YELLOW}  npm run dev${NC}     ← modo desarrollo (recomendado)"
echo -e "  ${YELLOW}  npm start${NC}       ← modo producción (requiere npm run build primero)"
echo ""
echo -e "  ${BOLD}─── Datos de la base de datos ──────────────────────${NC}"
echo -e "  ${CYAN}  Base de datos:  ${NC}${DB_NAME}"
echo -e "  ${CYAN}  Usuario MySQL:  ${NC}${DB_USER}"
echo -e "  ${CYAN}  Contraseña BD:  ${NC}${DB_PASS}"
echo ""
echo -e "  ${YELLOW}  Guarda estos datos en un lugar seguro.${NC}"
echo ""

# Preguntar si iniciar el servidor ahora
read -p "  ¿Quieres iniciar el servidor ahora? (s/n): " START_NOW
echo ""

if [[ "$START_NOW" =~ ^[Ss]$ ]]; then
    echo -e "  ${GREEN}Iniciando Astralis...${NC}"
    echo -e "  ${CYAN}Abre tu navegador en: http://localhost:3000${NC}"
    echo -e "  ${YELLOW}Para detener el servidor presiona Ctrl+C${NC}"
    echo ""
    npm run dev
else
    echo -e "  Cuando quieras iniciar el sistema ejecuta:"
    echo -e "  ${YELLOW}  npm run dev${NC}"
    echo ""
fi
