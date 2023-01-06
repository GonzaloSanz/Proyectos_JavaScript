'use strict'

/*
    Para este proyecto, se usará la API de Pixalbay.

    - Es gratis, pero es necesario crearse una cuenta para generar una APi key.
    - Información de la API: https://pixabay.com/api/docs/
*/

const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.addEventListener('load', () => {
    formulario.addEventListener('submit', validarFormulario);
});

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda.trim() === '') {
        mostrarAlerta('Agrega un término de búsqueda');
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100');

    // Si no existe la alerta, se crea
    if (!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');

        const alertaError = document.createElement('p');
        alertaError.classList.add('font-bold');
        alertaError.textContent = '¡Error!';

        const alertaMensaje = document.createElement('span');
        alertaMensaje.classList.add('block', 'sm:inline');
        alertaMensaje.textContent = mensaje;

        alerta.appendChild(alertaError);
        alerta.appendChild(alertaMensaje);

        formulario.appendChild(alerta);

        // Se elimina después de tres segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

async function buscarImagenes() {
    const termino = document.querySelector('#termino').value;

    const key = '28371733-2fe61b751ff1beca690fd595d';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    /*
        Alternativa con encadenamiento .then()
        
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => {
                totalPaginas = calcularPaginas(resultado.totalHits);
                mostrarImagenes(resultado.hits);
            });
    */

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();

        totalPaginas = calcularPaginas(resultado.totalHits);
        mostrarImagenes(resultado.hits);

    } catch (error) {
        console.log(error);
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

// Generador que va a registrar la cantidad de elementos de acuerdo a las páginas
function* crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function mostrarImagenes(imagenes) {
    limpiarHTML(resultado);

    // Iterar sobre el array de imágenes y crear el HTML
    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}" alt="Imagen ${termino}" />

                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-light">Me Gusta</span></p>
                        <p class="font-bold">${views} <span class="font-light">Veces Vista</span></p>
                    
                        <a class="block w-full bg-blue-800 hover:bg-blu-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver Imagen</a>
                    </div>
                </div>
            </div>
        `;
    });

    limpiarHTML(paginacionDiv);

    imprimirPaginador();
}

function limpiarHTML(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while (true) { // Se ejecuta todo el tiempo
        const { value, done } = iterador.next();

        if (done) return; // Si ya ha recorrido todos los valores, se sale de la función

        // Generar un botón por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mb-4', 'mr-2', 'font-bold', 'rounded');

        boton.onclick = () => {
            paginaActual = value;

            // Vuelve a consultar la API
            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}