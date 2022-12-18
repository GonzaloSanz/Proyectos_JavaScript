'use strict'

// Variables
const marca = document.querySelector('#marca');
const year = document.querySelector('#year');
const minimo = document.querySelector('#minimo');
const maximo = document.querySelector('#maximo');
const puertas = document.querySelector('#puertas');
const transmision = document.querySelector('#transmision');
const color = document.querySelector('#color');

// Contenedor para los resultados
const resultado = document.querySelector('#resultado');

const max = new Date().getFullYear(); // Año actual
const min = max - 10;

// Generar un objeto con la búsqueda
const datosBusqueda = {
    marca: '',
    year: '',
    minimo: '',
    maximo: '',
    puertas: '',
    transmision: '',
    color: '',
}

// Eventos
window.addEventListener('load', () => {
    // Mostrar los coches al cargar
    mostrarCoches(coches);

    // Llenar las opciones de años
    llenarSelectYears();

});

// Event listeners para los selects de búsqueda
marca.addEventListener('change', e => {
    datosBusqueda.marca = e.target.value;

    filtrarCoches();
});

year.addEventListener('change', e => {
    datosBusqueda.year = parseInt(e.target.value);

    filtrarCoches();
});

minimo.addEventListener('change', e => {
    datosBusqueda.minimo = parseInt(e.target.value);

    filtrarCoches();
});


maximo.addEventListener('change', e => {
    datosBusqueda.maximo = parseInt(e.target.value);

    filtrarCoches();
});

puertas.addEventListener('change', e => {
    datosBusqueda.puertas = parseInt(e.target.value);

    filtrarCoches();
});

transmision.addEventListener('change', e => {
    datosBusqueda.transmision = e.target.value;

    filtrarCoches();
});

color.addEventListener('change', e => {
    datosBusqueda.color = e.target.value;

    filtrarCoches();
});

// Funciones
// Mostrar todos los coches
function mostrarCoches(coches) {
    limpiarHTML();

    // Recorremos el array de coches ubicado en db.js
    coches.forEach(coche => {

        // Extraemos los componentes del objeto coche
        const { marca, modelo, year, puertas, transmision, precio, color } = coche;
        const cocheHTML = document.createElement('p');

        cocheHTML.textContent = `
            ${marca} ${modelo} - ${year} - ${puertas} Puertas - Transmisión: ${transmision} - Precio: ${precio} - Color: ${color}
        
        `;

        // Insertar en el HTML
        resultado.appendChild(cocheHTML);
    });
}

// Limpiar el contenido de resultados
function limpiarHTML() {
    // Mientras siga teniendo hijos, los elimina
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

// Rellenar el campo de filtrado por año
function llenarSelectYears() {
    for (let i = max; i >= min; i--) {
        let opcion = document.createElement('option');
        opcion.value = i;

        let textoOpcion = document.createTextNode(i);
        opcion.append(textoOpcion);


        // Agregar la opción de año al select
        year.appendChild(opcion);
    }
}

// Filtrar en base a la búsqueda
function filtrarCoches() {
    const resultado = coches.filter(filtrarMarca).filter(filtrarYear).filter(filtrarMinimo).filter(filtrarMaximo)
        .filter(filtrarPuertas).filter(filtrarTransmision).filter(filtrarColor);

    console.log(resultado.length);

    // Si la búsqueda tiene al menos un resultado...
    if (resultado.length) {
        mostrarCoches(resultado);
    } else {
        sinResultados();
    }
}

function sinResultados() {
    limpiarHTML();

    // Generamos el mensaje con el error
    const sinResultados = document.createElement('div');
    sinResultados.classList.add('alerta', 'error');

    const textoSinResultados = document.createTextNode('No hay resultados de búsqueda');
    sinResultados.append(textoSinResultados);

    resultado.appendChild(sinResultados);
}

function filtrarMarca(coche) {
    const { marca } = datosBusqueda;

    // Si hay algo en la marca, devuelve los coches que tengan la misma
    if (marca) {
        return coche.marca === marca;
    }
    return coche; // Si no está filtrando por marca, se devuelven los coches pasados para no perder la referencia.
}

function filtrarYear(coche) {
    const { year } = datosBusqueda;

    if (year) {
        return coche.year === year;
    }
    return coche;
}

function filtrarMinimo(coche) {
    const { minimo } = datosBusqueda;

    if (minimo) {
        return coche.precio >= minimo;
    }
    return coche;
}

function filtrarMaximo(coche) {
    const { maximo } = datosBusqueda;

    if (maximo) {
        return coche.precio <= maximo;
    }
    return coche;
}

function filtrarPuertas(coche) {
    const { puertas } = datosBusqueda;

    if (puertas) {
        return coche.puertas === puertas;
    }
    return coche;
}

function filtrarTransmision(coche) {
    const { transmision } = datosBusqueda;

    if (transmision) {
        return coche.transmision === transmision;
    }
    return coche;
}

function filtrarColor(coche) {
    const { color } = datosBusqueda;

    if (color) {
        return coche.color === color;
    }
    return coche;
}