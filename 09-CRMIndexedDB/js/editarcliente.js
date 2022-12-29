(function () {
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        // Actualizar el registro
        formulario.addEventListener('submit', actualizarCliente);

        // Verificar el ID de la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');

        if (idCliente) {
            // 0,3 segundos de retraso para que le de tiempo a leer la base de datos
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 300);
        }
    });

    function obtenerCliente(id) {
        const transaction = DB.transaction(['clientes'], 'readwrite');
        const objectStore = transaction.objectStore('clientes');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function (e) {
            const cursor = e.target.result;

            if (cursor) {
                // Si el id del registro coincide con el id pasado
                if (cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value);
                }

                // Avanza al siguiente registro
                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente) {

        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;

    }

    function conectarDB() {
        const abrirDB = window.indexedDB.open('crm', 1);

        abrirDB.onerror = function () {
            console.log('Hubo un error al acceder a la base de datos');
        }

        abrirDB.onsuccess = function () {
            DB = abrirDB.result;
        }
    }

    function actualizarCliente(e) {
        e.preventDefault();

        // Validación de campos
        if (nombreInput.value.trim() === '' || emailInput.value.trim() === '' || telefonoInput.value.trim() === '' || empresaInput.value.trim() === '') {
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

        // Actualizar el cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['clientes'], 'readwrite');
        const objectStore = transaction.objectStore('clientes');

        objectStore.put(clienteActualizado);

        // Si todo sale bien
        transaction.oncomplete = async function () {
            await Swal.fire({
                icon: 'success',
                title: '¡Cliente editado con éxito!',
                showConfirmButton: false,
                timer: 2500
            });

            // Redirigir al usuario al listado de clientes
            window.location.href = 'index.html';
        }

        // Si hubo algún error
        transaction.onerror = function () {
            Swal.fire({
                title: 'Error',
                text: 'El correo electrónico ya está registrado.',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Volver',
                showConfirmButton: true,
            });
        }
    }
})();