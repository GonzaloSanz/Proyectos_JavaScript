'use strict'

// Variables
const email = {
    email: '',
    asunto: '',
    mensaje: ''
}

// Seleccionar los elementos de la interfaz
const inputEmail = document.querySelector('#email');
const inputAsunto = document.querySelector('#asunto');
const inputMensaje = document.querySelector('#mensaje');
const formulario = document.querySelector('#formulario');
const btnSubmit = document.querySelector('#formulario button[type="submit"]');
const btnReset = document.querySelector('#formulario button[type="reset"]');
const spinner = document.querySelector('#spinner');

window.addEventListener('load', () => {

    // Asignar eventos 
    inputEmail.addEventListener('input', validar);
    inputAsunto.addEventListener('input', validar);
    inputMensaje.addEventListener('input', validar);

    btnSubmit.addEventListener('click', enviarEmail);

    btnReset.addEventListener('click', e => {
        // Prevenimos la acción del reset
        e.preventDefault();

        // Reiniciamos el formulario y el objeto email
        resetFormulario();
    });
});


// Funciones 
// Validar el contenido de los campos
function validar(e) {
    // Si el texto introducido está vacío...
    if (e.target.value.trim() === '') {
        mostrarAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement);
        email[e.target.name] = '';
        comprobarEmail();
        return;
    }

    // Si el email no es válido...
    if (e.target.id === 'email' && !validarEmail(e.target.value)) {
        mostrarAlerta(`El email no es válido`, e.target.parentElement);
        email[e.target.name] = '';
        comprobarEmail();
        return;
    }

    // Eliminamos la alerta correspondiente
    limpiarAlerta(e.target.parentElement);

    // Asignar los valores correspondientes al objeto email
    email[e.target.name] = e.target.value.trim().toLowerCase();

    // Comprobar el objeto de email
    comprobarEmail();
}

// Mostrar una alerta al usuario. Pasamos como parámetros el mensaje y el elemento padre
function mostrarAlerta(mensaje, referencia) {
    limpiarAlerta(referencia);

    // Generar una alerta en HTML
    const error = document.createElement('p');
    error.classList.add('bg-red-600', 'text-center', 'text-white', 'p-2');
    const textoError = document.createTextNode(mensaje);
    error.append(textoError);

    // Inyectar el error al formulario
    referencia.appendChild(error);
}

// Eliminar la alerta al pasar la validación del campo
function limpiarAlerta(referencia) {
    // Seleccionamos la alerta dentro del elemento padre
    const alerta = referencia.querySelector('.bg-red-600');

    // Si ya existe la alerta, la eliminamos
    if (alerta) {
        alerta.remove();
    }
}

// Comprobar que el email introducido es válido
function validarEmail(email) {
    const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    const resultado = regex.test(email);

    return resultado;
}

// Comprobar el objeto email
function comprobarEmail() {
    // Si alguno de los atributos está vacío...
    if (Object.values(email).includes('')) {
        // Deshabilitamos el botón de enviar
        btnSubmit.classList.add('opacity-50');
        btnSubmit.disabled = true;
        return;
    }

    // Habilitamos el botón de enviar
    btnSubmit.classList.remove('opacity-50');
    btnSubmit.disabled = false;
}

function resetFormulario() {
    // Reiniciar el objeto email
    email.email = '';
    email.asunto = '';
    email.mensaje = '';

    // Reseteamos el formulario y comprobamos el email
    formulario.reset();
    comprobarEmail();
}

// Simular el envío del email
function enviarEmail(e) {
    e.preventDefault();

    spinner.classList.add('flex');
    spinner.classList.remove('hidden');

    // Ocultar el spinner tras 3 segundos
    setTimeout(() => {
        spinner.classList.add('hidden');
        spinner.classList.remove('flex');

        // Reiniciamos el formulario y el objeto email
        resetFormulario();

        // Creamos una alerta 
        const alertaExito = document.createElement('p');
        alertaExito.classList.add('bg-green-500', 'text-white', 'my-5', 'p-2', 'text-center', 'rounded-lg', 'mt-10', 'font-bold',
            'text-xl', 'uppercase');
        const textoAlertaExito = document.createTextNode('Email enviado correctamente');

        alertaExito.append(textoAlertaExito);
        formulario.appendChild(alertaExito);

        // Eliminar la alerta tras 3 segundos
        setTimeout(() => {
            alertaExito.remove();
        }, 3000);

    }, 3000);
}