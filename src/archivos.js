const fs = require('node:fs/promises');

async function leerArchivo(ruta) {
    try {
        const contenido = await fs.readFile(ruta, 'utf-8');
        return JSON.parse(contenido);
    } catch (error) {
        console.error(`Error al leer el archivo: ${error.message}`);
        throw error;
    }
}

module.exports = {
    leerArchivo
};