'use strict'

window.addEventListener('load', () => {

    // Variables
    const carrito = document.querySelector('#carrito');
    const contenedorCarrito = document.querySelector('#lista-carrito tbody');
    const btnVaciarCarrito = document.querySelector('#vaciar-carrito');
    const listaCursos = document.querySelector('#lista-cursos');
    let articulosCarrito = [];

    cargarEventListeners();
    function cargarEventListeners() {
        // Agregar un curso presionando 'Agregar al Carrito'
        listaCursos.addEventListener('click', agregarCurso);

        // Eliminar curso del carrito
        carrito.addEventListener('click', eliminarCurso);

        // Vaciar el carrito
        btnVaciarCarrito.addEventListener('click', () => {
            // Reseteamos el arreglo
            articulosCarrito = [];

            // Eliminamos todo el HTML
            limpiarHTML();
        });
    }

    // Funciones
    function agregarCurso(e) {
        e.preventDefault();

        // Si el elemento seleccionado tiene la clase agregar-carrito...
        if (e.target.classList.contains('agregar-carrito')) {
            const cursoSeleccionado = e.target.parentElement.parentElement;

            leerDatosCurso(cursoSeleccionado);
        }
    }

    // Elimina el curso del carrito
    function eliminarCurso(e) {
        if (e.target.classList.contains('borrar-curso')) {
            const cursoId = e.target.getAttribute('data-id');

            // Eliminar del array de articulosCarrito por el data-id
            articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

            // Iterar sobre el carrito y mostrar su HTML
            carritoHTML();
        }
    }

    // Leer el contenido del HTML al que le dimos click y extraer la información del curso
    function leerDatosCurso(curso) {

        // Crear un objeto con el contenido del curso actual
        const infoCurso = {
            imagen: curso.querySelector('img').src,
            titulo: curso.querySelector('h4').textContent,
            precio: curso.querySelector('.precio span').textContent,
            id: curso.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        }

        // Revisar si un elemneto ya existe en el carrito
        const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);

        if (existe) {
            // Actualizamos la cantidad del curso
            const cursos = articulosCarrito.map(curso => {
                if (curso.id === infoCurso.id) {
                    curso.cantidad++;
                    return curso; // retorna el objeto actualizado
                } else {
                    return curso; // retorna los objetos no duplicados
                }
            });

            articulosCarrito = [...cursos];

        } else {
            // Agregar elementos al array del carrito
            articulosCarrito = [...articulosCarrito, infoCurso];
        }

        carritoHTML();
    }

    // Mostrar el carrito de compras en el HTML
    function carritoHTML() {

        // Limpiar el HTML
        limpiarHTML();

        // Recorrer el carrito y generar el HTML
        articulosCarrito.forEach(curso => {
            // Extraemos los valores
            const { imagen, titulo, precio, cantidad, id } = curso;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${imagen}" width="100" alt="Imagen curso">
                </td>
                <td>${titulo}</td>
                <td>${precio}</td>
                <td>${cantidad}</td> 
                <td>
                    <a href="#" class="borrar-curso" data-id="${id}"> X </a>
                </td>
            `;

            // Agregar el HTML del carrito en el tbody
            contenedorCarrito.appendChild(row);
        });
    }

    // Eliminar los cursos del tbody
    function limpiarHTML() {
        // Mientras tenga al menos un elemento dentro...
        while (contenedorCarrito.firstChild) {
            // Eliminamos el hijo
            contenedorCarrito.removeChild(contenedorCarrito.firstChild);
        }
    }
});