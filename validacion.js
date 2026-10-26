
function validarCampos({ nombre, correo, asunto, mensaje }) {
    return Boolean(nombre && correo && asunto && mensaje);
}

function validarCorreo(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

module.exports = {
    validarCampos,
    validarCorreo
};
