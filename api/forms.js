const { createClient } = require('@libsql/client');

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});

let tableReady;

function prepareTable() {
    if (!tableReady) {
        tableReady = client.execute(`
            CREATE TABLE IF NOT EXISTS forms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                correo TEXT NOT NULL,
                asunto TEXT NOT NULL,
                mensaje TEXT NOT NULL,
                creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    return tableReady;
}

function send(response, statusCode, data) {
    response.status(statusCode).json(data);
}

module.exports = async function handler(request, response) {
    if (request.method === 'OPTIONS') {
        response.status(204).end();
        return;
    }

    if (request.method !== 'POST') {
        send(response, 405, { error: 'Método no permitido.' });
        return;
    }

    try {
        const { nombre, correo, asunto, mensaje } = request.body || {};

        if (!nombre || !correo || !asunto || !mensaje) {
            send(response, 400, { error: 'Todos los campos son obligatorios.' });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            send(response, 400, { error: 'El correo no es válido.' });
            return;
        }

        await prepareTable();
        await client.execute({
            sql: `
                INSERT INTO forms (nombre, correo, asunto, mensaje)
                VALUES (?, ?, ?, ?)
            `,
            args: [nombre, correo, asunto, mensaje]
        });

        send(response, 201, { message: 'Formulario procesado correctamente.' });
    } catch (error) {
        console.error(error);
        send(response, 500, { error: 'No se pudo procesar el formulario.' });
    }
};
