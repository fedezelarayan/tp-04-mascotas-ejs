const express = require('express');
const path = require('node:path');
const expressLayout = require('express-ejs-layouts');
const { leerArchivo } = require('./archivos.js');

const PORT = 3000;

const rutaArchivo = path.join(__dirname, '..', 'datos', 'mascotas.json');

async function main() {
    try {
        const mascotas = await leerArchivo(rutaArchivo);
        const app = express();
        app.set('view engine', 'ejs'); /* indica q va a usar EJS como motor de plantilla */
        app.set("views", path.join(__dirname, "..", "views")); /* indica la ubicación de las vistas */
        app.use(expressLayout); /* indica que se va a usar express-ejs-layouts */
        app.set("layout", "layouts/main"); /* indica la ubicación del layout principal */
        app.use(express.static(path.join(__dirname, "..", "public"))); /* todo lo que esté en la carpeta public pueden accederse desde navegador */
        app.use(express.urlencoded({ extended: false })); /* permite que express pueda interpretar los datos enviados por formulario HTML */

        /* ------------------RUTAS------------------ */

        app.get('/', (req, res) => {
            res.render('inicio', {
                titulo: 'Mascotas'
            });
        });

        app.get('/mascotas', (req, res) => {
            res.render('mascotas/lista', {
                titulo: 'Catálogo de mascotas',
                mascotas
            });
        });

        app.get('/mascotas/nueva', (req, res) => {
            res.render('mascotas/nueva', {
                titulo: 'Registrar mascota',
                error: null,
                datos: {}
            });
        });

        app.get('/mascotas/:id', (req, res) => {
            const id = Number(req.params.id);

            const mascota = mascotas.find(mascota => mascota.id === id);

            if (!mascota) {
                return res.status(404).render('no-encontrado', {
                    titulo: 'Mascota no encontrada'
                });
            }

            res.render('mascotas/detalle', {
                titulo: mascota.nombre,
                mascota
            });
        });

        app.post('/mascotas', (req, res) => {
            const { nombre, especie, edad, estado, descripcion } = req.body; /* datos enviados desde el form */
            const edadNumero = Number(edad);  /* convertir la edad a numero */
            /* validaciones */
            if (
                !nombre ||
                !especie ||
                !estado ||
                !descripcion ||
                edad === undefined ||
                edad === '' ||
                !Number.isInteger(edadNumero) ||
                edadNumero < 0
            ) {
                return res.status(400).render('nueva', {
                    titulo: 'Registrar nueva mascota',
                    error: 'Todos los campos son obligatorios y la edad debe ser un número entero válido.',
                    datos: req.body
                });
            }

            /* genera nuevo ID */
            const nuevoId = mascotas.length > 0
                ? Math.max(...mascotas.map(mascota => mascota.id)) + 1
                : 1;

            /* crear la nueva mascotta */
            const nuevaMascota = {
                id: nuevoId,
                nombre: nombre.trim(),
                especie: especie.trim(),
                edad: edadNumero,
                estado,
                descripcion: descripcion.trim(),
                imagen: '/img/mascota.svg'
            };

            /* agrega la mascota al arreglo */
            mascotas.push(nuevaMascota);

            /* volver al listado */
            res.redirect('/mascotas');
        });

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error(`Error al iniciar la aplicación: ${error.message}`);
    }
};

main();


