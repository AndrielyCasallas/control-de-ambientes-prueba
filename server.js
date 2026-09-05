const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const database = new DatabaseSync(path.join(__dirname, 'forms.db'));
database.exec(`
    CREATE TABLE IF NOT EXISTS forms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        correo TEXT NOT NULL,
        asunto TEXT NOT NULL,
        mensaje TEXT NOT NULL,
        creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`);

const insertForm = database.prepare(`
    INSERT INTO forms (nombre, correo, asunto, mensaje)
    VALUES (?, ?, ?, ?)
`);

function sendJson(response, statusCode, data) {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    response.end(JSON.stringify(data));
}

const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, 'http://localhost');
    const requestPath = requestUrl.pathname;

    if (request.method === 'OPTIONS') {
        response.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return response.end();
    }

    if (request.method === 'POST' && requestPath === '/api/forms') {
        let body = '';

        request.on('data', (chunk) => {
            body += chunk;
        });

        request.on('end', () => {
            try {
                const form = JSON.parse(body);
                const { nombre, correo, asunto, mensaje } = form;

                if (!nombre || !correo || !asunto || !mensaje) {
                    return sendJson(response, 400, { error: 'Todos los campos son obligatorios.' });
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                    return sendJson(response, 400, { error: 'El correo no es válido.' });
                }

                insertForm.run(nombre, correo, asunto, mensaje);
                return sendJson(response, 201, { message: 'Formulario procesado correctamente.' });
            } catch (error) {
                return sendJson(response, 400, { error: 'No se pudo procesar el formulario.' });
            }
        });

        return;
    }

    if (requestPath.startsWith('/api/')) {
        return sendJson(response, 404, { error: 'Ruta no encontrada.' });
    }

    if (requestPath === '/favicon.ico') {
        response.writeHead(204);
        return response.end();
    }

    const requestedPath = requestPath === '/' ? '/index.html' : requestPath;
    const filePath = path.join(__dirname, requestedPath);
    const extension = path.extname(filePath);
    const contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
    };

    fs.readFile(filePath, (error, content) => {
        if (error) {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            return response.end('Página no encontrada');
        }

        response.writeHead(200, { 'Content-Type': contentTypes[extension] || 'text/plain' });
        response.end(content);
    });
});

const port = Number(process.env.PORT || 3000);

server.listen(port, () => {
    console.log(`Servidor disponible en el puerto ${port}`);
});
