'use strict'

// Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// Interfaz
const formulario = document.querySelector('#nueva-cita');
const btnFormulario = document.querySelector('#btnFormulario');
const contenedorCitas = document.querySelector('#citas');

let editando;

// Clases
class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    modificarCita(citaActualizada) {
        // Sustituirá la cita que tenga ese mismo id por la cita actualizada
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }

    eliminarCita(id) {
        // Devuelve las citas con id diferente al pasado
        this.citas = this.citas.filter(cita => cita.id !== id);

        // Mostrar un mensaje
        ui.imprimirAlerta('La cita se eliminó correctamente');

        // Refrescar las citas del HTML
        ui.imprimirCitas(administrarCitas);
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        // Crear el div 
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'col-12', 'mb-5');

        // Agregar clase en base al tipo del mensaje
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        const textoDivMensaje = document.createTextNode(mensaje);
        divMensaje.append(textoDivMensaje);

        // Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quitar la alerta después de tres segundos
        setTimeout(() => {
            divMensaje.remove();

            btnFormulario.disabled = false;
            btnFormulario.classList.remove('disabled');
        }, 3000);
    }

    imprimirCitas({ citas }) { // Se extrae el array de citas desde el objeto pasado

        this.limpiarHTML();

        citas.forEach(cita => {
            // Extraer la información del objeto de cita
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Scripting de los elementos de la lista
            const parrafoMascota = document.createElement('h2');
            parrafoMascota.classList.add('card-title', 'font-weight-bolder', 'mb-3');

            const textoParrafoMascota = document.createTextNode(mascota);
            parrafoMascota.append(textoParrafoMascota);

            const parrafoPropietario = document.createElement('p');
            parrafoPropietario.innerHTML = `
                <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const parrafoTelefono = document.createElement('p');
            parrafoTelefono.innerHTML = `
                <span class="font-weight-bolder">Teléfono: </span> ${telefono}
            `;

            const parrafoFecha = document.createElement('p');
            parrafoFecha.innerHTML = `
                <span class="font-weight-bolder">Fecha: </span> ${convertirFormatoFecha(fecha)}
            `;

            const parrafoHora = document.createElement('p');
            parrafoHora.innerHTML = `
                <span class="font-weight-bolder">Hora: </span> ${hora}
            `;

            const parrafoSintomas = document.createElement('p');
            parrafoSintomas.innerHTML = `
                <span class="font-weight-bolder">Síntomas: </span> ${sintomas}
            `;

            // Botón para modificar la cita
            const btnModificar = document.createElement('button');
            btnModificar.classList.add('btn', 'btn-primary', 'me-3');

            const textobtnModificar = document.createTextNode('Modificar');
            btnModificar.append(textobtnModificar);

            btnModificar.onclick = () => cargarEdicion(cita);

            // Botón para eliminar la cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');

            const textoBtnEliminar = document.createTextNode('Eliminar');
            btnEliminar.append(textoBtnEliminar);

            btnEliminar.onclick = () => administrarCitas.eliminarCita(id);

            // Agregar párrafos al div de la cita
            divCita.appendChild(parrafoMascota);
            divCita.appendChild(parrafoPropietario);
            divCita.appendChild(parrafoTelefono);
            divCita.appendChild(parrafoFecha);
            divCita.appendChild(parrafoHora);
            divCita.appendChild(parrafoSintomas);
            divCita.appendChild(btnModificar);
            divCita.appendChild(btnEliminar);

            // Agregar cita al contenedor de citas
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML() {
        // Mientras que haya alguna cita en el contenedor...
        while (contenedorCitas.firstChild) {
            // Se elimina el primer hijo
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

// Instanciar clases
const ui = new UI();
const administrarCitas = new Citas();

// Registrar eventos
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

// Objeto con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}

// Funciones
// Leemos los datos introducidos y rellenamos el objeto de cita
function datosCita(e) {
    // Introducimos el valor en la propiedad correspondiente
    citaObj[e.target.name] = e.target.value;
}

// Valida y agrega una nueva cita a la clase de citas
function nuevaCita(e) {
    e.preventDefault();

    // Desactivar el botón del formulario
    btnFormulario.classList.add('disabled');
    btnFormulario.disabled = true;

    // Extraer la información del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validación de campos
    if (mascota.trim() === '' || propietario.trim() === '' || telefono.trim() === '' || fecha.trim() === '' || hora.trim() === '' || sintomas.trim() === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    // Si se está en el modo edición...
    if (editando) {

        // Pasar el objeto de la cita a edición
        administrarCitas.modificarCita({ ...citaObj });

        // Mostramos mensaje de éxito
        ui.imprimirAlerta('Cita modificada correctamente');

        // Cambiar el texto del botón del formulario
        btnFormulario.textContent = 'Crear cita';

        // Quitar el modo edición
        editando = false;

    } else {
        // Generar un id único
        citaObj.id = Date.now(); // Aunque citaObj sea una constante, sus propiedades se pueden modificar

        // Crear una nueva cita
        administrarCitas.agregarCita({ ...citaObj }); // Pasamos una copia del objeto

        // Mostramos mensaje de éxito
        ui.imprimirAlerta('Cita creada correctamente');
    }

    reiniciarObjetoCita();

    // Reiniciamos el formulario
    formulario.reset();

    // Mostrar el HTML de las citas
    ui.imprimirCitas(administrarCitas);
}

// Cambiar el formato de la fecha de la cita
function convertirFormatoFecha(string) {
    return string.split('-').reverse().join('-');
}

// Vaciar las propiedades del objeto cita
function reiniciarObjetoCita() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

// Cargar los datos y el modo edición
function cargarEdicion(cita) {
    // Extraer la información del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Llenar los campos
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Cambiar el texto del botón del formulario
    btnFormulario.textContent = 'Guardar cambios';

    // Activar el modo edición
    editando = true;
}