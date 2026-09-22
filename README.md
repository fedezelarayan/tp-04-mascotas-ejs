# Trabajo práctico 04

## Descripción

En este proyecto se desarrolló una aplicación web utilizando **Node.js**, **Express**, **EJS** y **express-ejs-layouts**, que permite consultar un catálogo de mascotas y registrar nuevas mascotas mediante un formulario.

La aplicación trabaja con datos cargados inicialmente desde un archivo JSON y permite agregar nuevos registros durante la ejecución del servidor.

## Instalación

Para instalar las dependencias del proyecto, ubicarse en la carpeta raíz del proyecto y ejecutar:

npm install

Las principales dependencias utilizadas son:

* Express
* EJS
* express-ejs-layouts

## Ejecución

Para iniciar el servidor ejecutar:

node src/index.js

Luego ingresar desde el navegador a:

http://localhost:3000

## Páginas y rutas

La aplicación cuenta con las siguientes rutas:

| Método | Ruta              | Descripción                                      |
| ------ | ----------------- | ------------------------------------------------ |
| GET    | `/`               | Página de inicio                                 |
| GET    | `/mascotas`       | Muestra el catálogo de mascotas                  |
| GET    | `/mascotas/nueva` | Muestra el formulario para registrar una mascota |
| GET    | `/mascotas/:id`   | Muestra el detalle de una mascota                |
| POST   | `/mascotas`       | Procesa y registra una nueva mascota             |

La ruta `/mascotas/nueva` se declara antes de `/mascotas/:id` para evitar que `nueva` sea interpretado como un identificador.

## Estructura de vistas

Las vistas se encuentran dentro de la carpeta `views`:

views/
├── layouts/
│   └── main.ejs
├── partials/
│   ├── encabezado.ejs
│   └── pie.ejs
├── mascotas/
│   ├── lista.ejs
│   └── detalle.ejs
│   └── nueva.ejs
├── inicio.ejs
└── no-encontrado.ejs

### Layout, vista y parcial

El **layout** es una plantilla general que define la estructura común de las páginas. En este proyecto, `layouts/main.ejs` contiene el documento HTML principal, el encabezado, el contenido principal y el pie de página.

La **vista** contiene el contenido específico de cada página. Por ejemplo, `mascotas/lista.ejs` muestra el listado de mascotas y `nueva.ejs` contiene el formulario de registro.

Un **parcial** es un fragmento reutilizable de una vista. En este proyecto se utilizan `encabezado.ejs` y `pie.ejs` para evitar repetir el mismo código en todas las páginas.

## Datos enviados a una vista mediante `res.render`

Express permite enviar datos desde una ruta hacia una vista utilizando `res.render()`.

Por ejemplo:

```js
res.render('mascotas/lista', {
    titulo: 'Catálogo de mascotas',
    mascotas
});
```

En este caso, la vista recibe las variables `titulo` y `mascotas`, que pueden utilizarse desde EJS mediante expresiones como:

```ejs
<h1><%= titulo %></h1>
```

y:

```ejs
<% mascotas.forEach(mascota => { %>
    <p><%= mascota.nombre %></p>
<% }); %>
```

## Recursos estáticos

Los recursos estáticos se encuentran dentro de la carpeta `public`:

```text
public/
├── css/
│   └── estilos.css
├── img/
│   └── mascota.svg
└── js/
    └── app.js
```

Para hacerlos accesibles desde el navegador se utiliza:

```js
app.use(express.static(path.join(__dirname, '..', 'public')));
```

La función `express.static` permite que Express sirva archivos estáticos como hojas de estilos CSS, imágenes y archivos JavaScript.

Por ejemplo, el archivo:

```text
public/css/estilos.css
```

se puede acceder desde el navegador mediante:

```text
/css/estilos.css
```

## Formulario

El formulario se encuentra en:

```text
views/nueva.ejs
```

Utiliza el método `POST` y envía los datos a:

```text
/mascotas
```

```html
<form action="/mascotas" method="post">
```

Los datos enviados por el formulario son recibidos mediante `req.body`.

Para que Express pueda interpretar los datos enviados mediante formularios HTML se utiliza:

```js
app.use(express.urlencoded({ extended: false }));
```

La función `express.urlencoded` procesa los datos enviados con el formato `application/x-www-form-urlencoded` y los deja disponibles en `req.body`.

El servidor obtiene los datos de esta manera:

```js
const { nombre, especie, edad, estado, descripcion } = req.body;
```

Luego se valida que los campos estén completos y que la edad sea un número entero válido.

Si existe un error, se responde con estado HTTP `400` y se vuelve a mostrar el formulario conservando los valores ingresados.

Si los datos son válidos, se crea una nueva mascota, se agrega al arreglo y se realiza una redirección:

```js
res.redirect('/mascotas');
```

## Recorrido POST, redirección y GET

El flujo para registrar una mascota es el siguiente:

1. El usuario ingresa a `GET /mascotas/nueva`.
2. Se muestra el formulario.
3. El usuario completa los datos y presiona el botón de registro.
4. El navegador envía una petición `POST /mascotas`.
5. Express recibe los datos mediante `req.body`.
6. El servidor valida los datos.
7. Si hay errores, vuelve a mostrar el formulario con un estado `400`.
8. Si los datos son correctos, se agrega la nueva mascota al arreglo.
9. El servidor ejecuta `res.redirect('/mascotas')`.
10. El navegador realiza una nueva petición `GET /mascotas`.
11. Se muestra nuevamente el listado incluyendo la mascota recién registrada.

La redirección permite separar el procesamiento del formulario de la visualización del listado.

## Persistencia de los datos

Los datos iniciales de las mascotas se encuentran en:

```text
datos/mascotas.json
```

Al iniciar la aplicación, estos datos son leídos y cargados en memoria.

Las nuevas mascotas se agregan al arreglo utilizando `push()`:

```js
mascotas.push(nuevaMascota);
```

Sin embargo, en este trabajo práctico **no se modifica el archivo JSON** cuando se registra una nueva mascota.

Por este motivo, los nuevos registros solamente permanecen en memoria mientras el servidor está ejecutándose.

Al reiniciar el servidor, el arreglo vuelve a cargarse desde `mascotas.json`, que no contiene los nuevos registros. Por eso las mascotas agregadas durante la ejecución desaparecen después de reiniciar.

Esto significa que el proyecto utiliza una persistencia inicial mediante un archivo JSON, pero los nuevos registros realizados desde el formulario **no tienen persistencia permanente**.
