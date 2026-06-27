# Multitenant SaaS Task Manager (NestJS)

Este proyecto es la recreación e implementación de un **Multitenant SaaS Task Manager** (Gestor de Tareas SaaS Multitenant) en **NestJS (Node.js / TypeScript)**.

## 🛠️ Stack Tecnológico

El proyecto está diseñado bajo una arquitectura modular y escalable utilizando las siguientes tecnologías:

- **Backend Framework**: [NestJS](https://nestjs.com/) v11
- **Base de Datos Core**: PostgreSQL gestionado a través de [Prisma ORM](https://www.prisma.io/)
- **Base de Datos de Auditoría / Logs**: MongoDB
- **Mensajería / Colas Asíncronas**: Redis con [BullMQ](https://github.com/taskforcesh/bullmq) para notificaciones y tareas en segundo plano
- **Autenticación y Seguridad**: Passport JWT y soporte para WebAuthn / MFA

---

## 📂 Estructura del Proyecto

```text
├── api/                  # Código fuente del backend en NestJS
│   ├── prisma/           # Esquema de base de datos y migraciones de Prisma
│   ├── src/              # Controladores, servicios, guards, middlewares y módulos
│   └── test/             # Pruebas unitarias y de integración (E2E)
├── infrastructure/       # Configuración del entorno y Docker (Base de datos, Redis, MongoDB)
├── CONTEXT.md            # Guía detallada con especificaciones de diseño y migración
├── docker-start.sh       # Script para arrancar contenedores Docker según el entorno
└── docker-stop.sh        # Script para detener los contenedores Docker
```

---

## 🚀 Inicio Rápido (Docker)

El proyecto cuenta con configuraciones Docker para levantar rápidamente las dependencias externas (PostgreSQL, MongoDB, Redis).

### 1. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` en la raíz del proyecto, en `infrastructure/` y en `api/`:

```bash
# En la raíz
cp .env.example .env

# En infrastructure
cp infrastructure/.env.example infrastructure/.env

# En api
cp api/.env.example api/.env
```

Asegúrate de configurar `APP_ENV` en el `.env` raíz (por defecto es `local`).

### 2. Levantar Servicios con Docker

Ejecuta el script de inicio para arrancar las bases de datos y la API en contenedores de desarrollo:

```bash
./docker-start.sh
```

Esto leerá la variable `APP_ENV` de tu `.env` raíz y cargará el archivo docker-compose adecuado (ej. `infrastructure/docker-compose.local.yml`).

Para detener los servicios, ejecuta:

```bash
./docker-stop.sh
```

---

## 💻 Desarrollo Local (Sin Docker para la API)

Si prefieres ejecutar el servidor de NestJS localmente en tu máquina (conectándolo a las bases de datos levantadas en Docker):

### 1. Levantar bases de datos
Puedes levantar únicamente las bases de datos (PostgreSQL, MongoDB, Redis) comentando o deteniendo el contenedor de la `api` en el archivo de docker-compose, o ejecutando:
```bash
docker-compose -f infrastructure/docker-compose.local.yml up postgres mongodb redis -d
```

### 2. Instalar Dependencias de la API
Ve al directorio `api/` e instala las dependencias mediante `yarn`:

```bash
cd api
yarn install
```

### 3. Ejecutar Migraciones y Generar Prisma Client
Aplica las migraciones de Prisma para configurar la base de datos PostgreSQL local:

```bash
npx prisma migrate dev
```

### 4. Iniciar el Servidor de Desarrollo
Levanta la aplicación en modo watch (recarga en caliente):

```bash
yarn start:dev
```

La API estará disponible en `http://localhost:3000`.

---

## 🧪 Pruebas

Los scripts de prueba se encuentran definidos en el `package.json` de la carpeta `api/`:

```bash
cd api

# Ejecutar pruebas unitarias
yarn test

# Ejecutar pruebas de integración (E2E)
yarn test:e2e

# Ejecutar pruebas con cobertura
yarn test:cov
```

---

## ⚙️ Características Clave Implementadas

1. **Aislamiento Multitenant**: Implementado de forma transparente mediante `AsyncLocalStorage` y Prisma Extensions, filtrando automáticamente por `tenantId` en las operaciones de base de datos sin necesidad de añadir el filtro manualmente en cada query.
2. **Caché en Repositorios**: Patrón Repository decorado con Redis para optimizar el acceso a tareas recurrentes de forma aislada por Tenant.
3. **Control de Acceso basado en Roles (RBAC)**: Middleware y `TaskPolicyGuard` que restringen las operaciones de escritura/borrado a roles no autorizados (ej. `VIEWER`).
4. **Idempotencia de Jobs**: Consumo de eventos asíncronos en cola mediante BullMQ y validación mediante logs de auditoría en base de datos para evitar envíos duplicados.
