'use strict'

const formulario = document.querySelector('#cotizar-seguro');
const btnFormulario = document.querySelector('#btnFormulario');

// Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// Realizar la cotización con los datos
Seguro.prototype.cotizarSeguro = function () {
    /*
        1 -> Americana 1.15
        2 -> Asiática 1.05
        3 -> Europea 1.35
    */
    let cantidad;
    const base = 2000;

    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;

        case '2':
            cantidad = base * 1.05;
            break;

        case '3':
            cantidad = base * 1.35;
            break;

        default:
            break;
    }

    // Recogemos los años de diferencia
    const diferencia = new Date().getFullYear() - this.year;

    // Con cada año de diferencia, el coste del seguro se reduce un 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /*
        Seguro básico -> Se multiplica por un 30% más.
        Seguro completo -> Se multipllica por un 50% más.
    */

    if (this.tipo === 'basico') {
        cantidad *= 1.30;

    } else {
        cantidad *= 1.50;
    }

    // Devolvemos el total, y en caso de que sea un número decimal, con sólo dos decimales
    return (cantidad % 1 === 0) ? cantidad : cantidad.toFixed(2);
}

function UI() { }

// Llenar las opciones de los años en el formulario
UI.prototype.llenarOpciones = () => {
    const selectYear = document.querySelector('#year');

    const max = new Date().getFullYear(),
        min = max - 20;

    for (let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;

        let textoOpcion = document.createTextNode(i);
        option.append(textoOpcion);

        // Añadir option al select de años
        selectYear.appendChild(option);
    }
}

// Mostrar alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {

    const divMensaje = document.createElement('div');

    if (tipo === 'error') {
        divMensaje.classList.add('error');
    } else {
        divMensaje.classList.add('correcto');
    }

    divMensaje.classList.add('mensaje', 'mt-10');

    const textoDivMensaje = document.createTextNode(mensaje);
    divMensaje.append(textoDivMensaje);

    // Insertar en el HTML
    formulario.insertBefore(divMensaje, document.querySelector('#resultado'));

    // Eliminar mensaje después de tres segundos y activar el botón del formulario
    setTimeout(() => {
        divMensaje.remove();

        btnFormulario.disabled = false;
        btnFormulario.classList.remove('cursor-not-allowed', 'opacity-50');
    }, 3000);
}

// Mostrar el resultado final por pantalla
UI.prototype.mostrarResultado = (seguro, total) => {

    const { marca, year, tipo } = seguro;

    let nombreMarca;

    switch(marca) {
        case '1':
            nombreMarca = 'Americana';
            break;
        case '2':
            nombreMarca = 'Asiática';
            break;
        case '3':
            nombreMarca = 'Europea';
             break;
        default:
            break;
    }

    const div = document.createElement('div');
    div.classList.add('mt-10');

    // Contenido del resumen
    div.innerHTML = `
        <p class="header">Tu resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${nombreMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo de Seguro: <span class="font-normal capitalize">${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">${total} euros</span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado');

    // Mostrar el spinner 
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    // Depsués de tres segundos, desaparece el spinner pero se muestra la cotización
    setTimeout(() => {
        spinner.style.display = 'none';

        resultadoDiv.appendChild(div);
    }, 3000);
}

// Instanciar UI
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    // Llenar el select con los años
    ui.llenarOpciones();
});

eventListeners();
function eventListeners() {
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    // Desactivar el botón del formulario
    btnFormulario.classList.add('cursor-not-allowed', 'opacity-50');
    btnFormulario.disabled = true;

    // Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;

    // Leer el año seleccionado
    const year = document.querySelector('#year').value;

    // Leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if (marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    ui.mostrarMensaje('Cotizando...', 'exito');

    // Ocultar cotizaciones previas
    const resultados = document.querySelector('#resultado div');

    if(resultados != null) {
        resultados.remove();
    }

    // Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    // Utilizar el prototype de cotización
    UI.prototype.mostrarResultado(seguro, total);
}