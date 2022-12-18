'use strict'

// Variables
const formulario = document.querySelector('#formulario');
const listaTweets = document.querySelector('#lista-tweets');
let tweets = [];

// Event Listeners
eventListeners();

function eventListeners() {

    // Cuando el usuario agrega un nuevo tweet
    formulario.addEventListener('submit', agregarTweet);

    // Cuando el documento está listo
    document.addEventListener('DOMContentLoaded', () => {

        // Si no hay tweets, lo convierte a un arreglo vacío para que no de error en crearHTML()
        tweets = JSON.parse(localStorage.getItem('tweets')) || [];

        crearHTML();
    });
}

// Funciones

// Agregar el tweet
function agregarTweet(e) {
    e.preventDefault();

    // Textarea donde el usuario escribe el tweet
    const tweet = document.querySelector('#tweet').value;

    // Validación
    if (tweet.trim() === '') {
        mostrarError('El tweet no puede ir vacío');
        return;
    }

    const tweetObj = {
        id: Date.now(), // Devuelve el número de milisegundos transcurridos desde el 1 de Enero de 1970
        tweet // Llave y valor se llaman de la misma forma, por lo que se puede dejar sólo uno.
    }

    // Añadir al array de tweets
    tweets = [...tweets, tweetObj];

    // Una vez agregado, creamos el HTML
    crearHTML();

    // Reiniciar el formulario
    formulario.reset();
}

// Mostrar mensaje de error
function mostrarError(error) {

    limpiarError();

    // Crear el mensaje
    const mensajeError = document.createElement('p');
    mensajeError.classList.add('error');

    const textoMensajeError = document.createTextNode(error);
    mensajeError.append(textoMensajeError);

    // Insertarlo en el contenido
    const contenido = document.querySelector('#contenido');
    contenido.appendChild(mensajeError);

    // Eliminar la alerta después de tres segundos
    setTimeout(() => {
        mensajeError.remove();
    }, 3000);
}

// Limpiar el mensaje de error si ya existe
function limpiarError() {
    const error = document.querySelector('.error');

    if (error) {
        error.remove();
    }
}

// Muestra un listado de los tweets
function crearHTML() {

    limpiarHTML();

    // Si el array tiene al menos un tweet...
    if (tweets.length > 0) {
        tweets.forEach(tweet => {

            // Crear un botón de eliminar tweet
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-tweet');

            const textoBtnEliminar = document.createTextNode('X');
            btnEliminar.append(textoBtnEliminar);

            btnEliminar.onclick = () => {
                borrarTweet(tweet.id);
            };

            // Crear el elemento li
            const li = document.createElement('li');
            const textoLi = document.createTextNode(tweet.tweet);
            li.append(textoLi);

            // Añadir botón de eliminar
            li.appendChild(btnEliminar);

            // Añadirlo al listado de tweets
            listaTweets.appendChild(li);
        });
    }

    sincronizarStorage();
}

// Limpiar el HTML
function limpiarHTML() {

    // Mientras la lista de tweets siga teniendo elementos, los borra.
    while (listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild);
    }
}

// Agregar los tweets actuales a LocalStorage
function sincronizarStorage() {
    localStorage.setItem('tweets', JSON.stringify(tweets));
}

// Borrar el tweet al pulsar sobre el botón de eliminar
function borrarTweet(id) {
    // Mantenemos los tweet que no tengan ese id
    tweets = tweets.filter(tweet => tweet.id !== id);

    crearHTML();
}