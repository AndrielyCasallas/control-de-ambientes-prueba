# Despliegue en Vercel

La versión de producción usa una función de Vercel en `api/forms.js` y una base SQLite remota de Turso. El archivo local `forms.db` se mantiene únicamente para ejecutar el proyecto en desarrollo.

## Configuración

1. Crea una base de datos en [Turso](https://turso.tech/).
2. Obtén la URL de la base y un token de acceso.
3. En el proyecto de Vercel, añade estas variables de entorno:

```text
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

4. Importa el repositorio en Vercel y despliega la rama `main`.
5. Abre la URL asignada por Vercel.

El formulario enviará los datos a `/api/forms`. La tabla se crea automáticamente en Turso en el primer envío.

Para trabajar localmente se mantiene:

```bash
npm start
```
