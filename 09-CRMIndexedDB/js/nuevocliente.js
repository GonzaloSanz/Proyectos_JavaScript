(function () {
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    });

    function validarCliente(e) {
        e.preventDefault();

        // Leer todos los inputs 
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        // Validación de campos
        if (nombre.trim() === '' || email.trim() === '' || telefono.trim() === '' || empresa.trim() === '') {
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

        // Crear un objeto con la información
        const cliente = {
            nombre, // nombre : nombre (Propiedad y valor se llaman igual, por lo que se puede dejar solo uno)
            email,
            telefono,
            empresa,
            id: Date.now()
        }

        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        // Agregar el cliente a la base de datos
        const transaction = DB.transaction(['clientes'], 'readwrite');
        const objectStore = transaction.objectStore('clientes');

        objectStore.add(cliente);

        // Si todo sale bien
        transaction.oncomplete = async function () {
            await Swal.fire({
                icon: 'success',
                title: '¡Cliente agregado con éxito!',
                showConfirmButton: false,
                timer: 2500
            });

            // Redirigir al usuario al listado de clientes
            window.location.href = 'index.html';
        }

        // Si ha ocurrido algún error
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