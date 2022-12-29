(function () {
    let DB;

    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        // Si la base de datos existe, cargamos los clientes que contenga
        if (window.indexedDB.open('crm', 1)) {
            obtenerClientes();

            listadoClientes.addEventListener('click', eliminarRegistro);
        }
    });

    function eliminarRegistro(e) {

        // Comprobamos si el elemento clickado tiene la clase 'eliminar'
        if (e.target.classList.contains('eliminar')) {
            // Recogemos el id del cliente (data-cliente = id)
            const idEliminar = Number(e.target.dataset.cliente);

            Swal.fire({
                title: '¿Deseas eliminar este cliente?',
                text: "No podrás revertir los cambios.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {

                    const transaction = DB.transaction(['clientes'], 'readwrite');
                    const objectStore = transaction.objectStore('clientes');

                    objectStore.delete(idEliminar);

                    transaction.oncomplete = function() {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Cliente borrado con éxito!',
                            showConfirmButton: false,
                            timer: 2500
                        });

                        e.target.parentElement.parentElement.remove();
                    }

                    transaction.onerror = function() {
                        Swal.fire({
                            icon: 'error',
                            title: 'Hubo un error al borrar el cliente',
                            showConfirmButton: false,
                            timer: 2500
                        });
                    }
                }
            });
        }
    }

    function obtenerClientes() {
        const abrirDB = window.indexedDB.open('crm', 1);

        abrirDB.onerror = function () {
            console.log('Hubo un error al acceder a la base de datos');
        }

        abrirDB.onsuccess = function () {
            DB = abrirDB.result;

            const objectStore = DB.transaction('clientes').objectStore('clientes');

            objectStore.openCursor().onsuccess = function (e) {
                const cursor = e.target.result;

                if (cursor) {
                    const { nombre, empresa, email, telefono, id } = cursor.value;

                    const listadoClientes = document.querySelector('#listado-clientes');

                    listadoClientes.innerHTML += ` 
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                        </tr>
                    `;

                    // Continuar con los siguientes registros
                    cursor.continue();
                }
            }
        }
    }
})();