'use strict'

let DB;

// Crear la base de datos de IndexedDB
function crearDB() {
    const crearDB = window.indexedDB.open('crm', 1);

    crearDB.onerror = function () {
        console.log('Hubo un error al crear la base de datos');
    }

    crearDB.onsuccess = function () {
        // Asignamos a DB el resultado de creación
        DB = crearDB.result;
    }

    // Configuración
    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('clientes', {
            keyPath: 'id',
            autoIncrement: true
        });

        objectStore.createIndex('nombre', 'nombre', { unique: false });
        objectStore.createIndex('email', 'email', { unique: true });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('empresa', 'empresa', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });
    }
}

// Conectar a IndexedDB
function conectarDB() {
    const abrirDB = window.indexedDB.open('crm', 1);

    abrirDB.onerror = function () {
        console.log('Hubo un error al acceder a la base de datos');
    }

    abrirDB.onsuccess = function () {
        DB = abrirDB.result;
    }
}