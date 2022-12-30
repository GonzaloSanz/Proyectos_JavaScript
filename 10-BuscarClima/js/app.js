'use strict'

/*
    API del proyecto -> https://openweathermap.org/

    - Es gratis pero es necesario crearse una cuenta.
    - Una vez dentro, generamos una API key para poder acceder a ella.
*/

const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});

// Buscar el clima con los valores introducidos
function buscarClima(e) {
    e.preventDefault();

    // Validar campos
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad.trim() === '' || pais.trim() === '') {
        Swal.fire({
            title: 'Error',
            text: 'Todos los campos son obligatorios.',
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Volver',
            showConfirmButton: true,
        });

        return;
    }

    // Consultar la API
    consultarAPI(ciudad, pais);
}

// Hacer una consulta a la API con los datos validados
function consultarAPI(ciudad, pais) {
    const appId = '5d0d75ebdceb6bea55d1cc0621b9fd08';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    spinner();

    setTimeout(() => {
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(datos => {
                limpiarHTML();

                if (datos.cod === '404') { // Si devuelve ese código, la ciudad no existe
                    Swal.fire({
                        title: 'Error',
                        text: 'La ciudad introducida no existe.',
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Volver',
                        showConfirmButton: true,
                    });

                    return;
                }

                mostrarClima(datos);

                formulario.reset();
            });
    }, 1000);
}

// Mostrar los datos del clima en el HTML
function mostrarClima(datos) {
    // Extraer la información necesaria del objeto
    const { name, main: { temp, temp_max, temp_min } } = datos;

    // Conversión de Kelvin a grados centígrados 
    const actual = kelvinACentigrados(temp);
    const maxima = kelvinACentigrados(temp_max);
    const minima = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const textoNombreCiudad = document.createTextNode(`Clima en ${name}`);
    nombreCiudad.append(textoNombreCiudad);

    const tempActual = document.createElement('p');
    tempActual.innerHTML = `${actual.toFixed(0)} &#8451;`;
    tempActual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Temperatura Máxima: ${maxima.toFixed(0)} &#8451;`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Temperatura Mínima: ${minima.toFixed(0)} &#8451;`;
    tempMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');

    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(tempActual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
}

// Conversión de grados kelvin a grados centígrados
const kelvinACentigrados = (grados) => parseInt(grados - 273.15); // 0°C -> 273,15K

// Quitar los resultados anteriores
function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

// Agregar un spinner al HTML
function spinner() {
    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
        <div class="sk-fading-circle">
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `;

    resultado.appendChild(divSpinner);
}