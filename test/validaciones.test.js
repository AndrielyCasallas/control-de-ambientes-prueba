
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const {
    validarCampos,
    validarCorreo
} = require('../validacion');

const PORT = 3001;
const BASE_URL = `http://127.0.0.1:${PORT}`;

let serverProcess;

before(async () => {
    serverProcess = spawn(
        process.execPath,
        ['server.js'],
        {
            env: { ...process.env, PORT: String(PORT) },
            stdio: 'ignore'
        }
    );

    let ready = false;

    for (let i = 0; i < 50; i++) {
        if (serverProcess.exitCode !== null) {
            throw new Error('El servidor de pruebas se cerró inesperadamente.');
        }

        try {
            const response = await fetch(`${BASE_URL}/`);
            if (response.status === 200) {
                ready = true;
                break;
            }
        } catch {
            // Esperar mientras inicia el servidor.
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!ready) {
        serverProcess.kill();
        throw new Error('No fue posible iniciar el servidor de pruebas.');
    }
});

after(() => {
    if (serverProcess && serverProcess.exitCode === null) {
        serverProcess.kill();
    }
});

// PRUEBAS UNITARIAS

test('CP-UN-01: acepta todos los campos completos', () => {
    assert.equal(
        validarCampos({
            nombre: 'Juan',
            correo: 'juan@example.com',
            asunto: 'Consulta',
            mensaje: 'Mensaje de prueba'
        }),
        true
    );
});

test('CP-UN-02: rechaza un correo con formato inválido', () => {
    assert.equal(validarCorreo('correo-invalido'), false);
});

// PRUEBAS DE INTEGRACIÓN / API

test('CP-IN-01: acepta un formulario válido', async () => {
    const response = await fetch(`${BASE_URL}/api/forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre: 'Juan Prueba',
            correo: 'juan.prueba@example.com',
            asunto: 'Prueba automatizada',
            mensaje: 'Mensaje de prueba'
        })
    });

    const data = await response.json();

    assert.equal(response.status, 201);
    assert.equal(data.message, 'Formulario procesado correctamente.');
});

test('CP-IN-02: rechaza campos obligatorios vacíos', async () => {
    const response = await fetch(`${BASE_URL}/api/forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre: '',
            correo: 'juan.prueba@example.com',
            asunto: 'Prueba',
            mensaje: 'Mensaje'
        })
    });

    const data = await response.json();

    assert.equal(response.status, 400);
    assert.equal(data.error, 'Todos los campos son obligatorios.');
});

test('CP-IN-03: rechaza una ruta API inexistente', async () => {
    const response = await fetch(`${BASE_URL}/api/ruta-inexistente`);

    assert.equal(response.status, 404);
});
