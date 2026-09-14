# Formulario de contacto La Salle

> Ambiente de producción

Sistema backend desarrollado en **Node.js** para gestionar un formulario de contacto y almacenar sus registros en una base de datos SQLite distribuida mediante **Turso (libSQL)**. El proyecto está optimizado para el despliegue continuo en **Render**.

## Stack tecnológico

| Componente | Tecnología |
| --- | --- |
| Runtime | Node.js |
| Base de datos | Turso (libSQL / SQLite en el borde) |
| Infraestructura de despliegue | Render |

## Configuración del entorno

La aplicación no incluye archivos `.env` versionados en Git. Las credenciales de conexión se gestionan de forma segura mediante variables de entorno, configuradas directamente en el entorno de despliegue de Render.

### Variables de entorno requeridas

- `TURSO_DATABASE_URL`: URL de conexión a la base de datos libSQL (`libsql://...`)
- `TURSO_AUTH_TOKEN`: Token de autenticación de Turso.
- `PORT`: Puerto local en el que se ejecutará la aplicación.

Para realizar pruebas locales, copia `.env.example` como `.env` en la raíz del proyecto y reemplaza los valores de conexión con tus credenciales de Turso:

```bash
cp .env.example .env
```

```dotenv
TURSO_DATABASE_URL=libsql://tu-base-de-datos.turso.io
TURSO_AUTH_TOKEN=tu_token_de_autenticacion_aqui
PORT=3000
```

## Guía de ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/AndrielyCasallas/control-de-ambientes-prueba.git
cd control-de-ambientes-prueba
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar el entorno

Completa las variables `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` del archivo `.env` con las credenciales de tu instancia de Turso.

### 4. Ejecutar la aplicación

```bash
npm start
# En modo desarrollo, si usas nodemon:
npm run dev
```

### 5. Verificar el servicio

Abre tu navegador en [http://localhost:3000](http://localhost:3000) para interactuar con el formulario.

## Estructura de datos del formulario

El sistema procesa y almacena en Turso los siguientes campos:

- **Nombre:** Identificador del remitente.
- **Correo electrónico:** Dirección de contacto.
- **Asunto:** Motivo o título del mensaje.
- **Mensaje:** Contenido de la solicitud.

## Contribuciones del equipo

| Integrante | Usuario de GitHub | Rol / Módulos asignados |
| --- | --- | --- |
| Andriely Alejandro Casallas Calderón | [@AndrielyCasallas](https://github.com/AndrielyCasallas) | Arquitectura base, integración con Turso y despliegue en Render |
| Juan Felipe Rodriguez Castellanos | JuanFeCastell | README, integración con Turso y despliegue en Render |