'use strict'

/*
    Este proyecto se ha realizado con Node JS y JSON-Server.

    - Instalación de Node JS -> https://nodejs.org/es/
    - Instalación de JSON Server: 
        + Abrir Powershell en modo administrador
        + Instalarlo de forma global con 'npm install -g json-server'

    - Levantar la API del proyecto:
        + Abrimos una terminal del proyecto y ejecutamos 'json-server --watch db.json --port 4000'
*/

let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');

window.addEventListener('load', () => {
    btnGuardarCliente.addEventListener('click', guardarCliente);

});

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    // Revisar si los campos están vacíos
    const camposVacios = [mesa, hora].some(campo => campo.trim() === '');

    if (camposVacios) {
        mostrarError('Todos los campos son obligatorios');
        return;
    }

    // Asignar datos del formulario al cliente
    cliente = { ...cliente, mesa, hora };

    // Ocultar modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    mostrarSecciones();

    // Obtener platos de la API de JSON-Server
    obtenerPlatos();
}

function mostrarError(mensaje) {
    // Verificar si ya existe una alerta
    const existeAlerta = document.querySelector('.error');

    if (!existeAlerta) {
        const alerta = document.createElement('div');
        alerta.classList.add('error', 'd-block', 'text-center', 'text-white', 'bg-danger', 'rounded-3', 'p-2');
        alerta.textContent = mensaje;

        // Añadir error a la ventana modal
        document.querySelector('.modal-body form').appendChild(alerta);

        // Eliminar la alerta después de tres segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');

    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatos() {
    const url = 'http://localhost:4000/platos';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(platos => mostrarPlatos(platos))
        .catch(error => console.log(error));
}

function mostrarPlatos(platos) {
    const contenido = document.querySelector('#platillos .contenido');

    platos.forEach(plato => {
        const { id, nombre, precio, categoria } = plato;

        const row = document.createElement('div');
        row.classList.add('row', 'py-4', 'border-top', 'align-items-center');

        const nombrePlato = document.createElement('div');
        nombrePlato.classList.add('col-md-4');
        nombrePlato.textContent = nombre;

        const precioPlato = document.createElement('div');
        precioPlato.classList.add('col-md-3', 'fw-bold');
        precioPlato.textContent = `${precio} €`;

        const categoriaPlato = document.createElement('div');
        categoriaPlato.classList.add('col-md-3');
        categoriaPlato.textContent = categorias[categoria];

        const divAgregarCantidad = document.createElement('div');
        divAgregarCantidad.classList.add('col-md-2');

        const inputCantidad = document.createElement('input');
        inputCantidad.classList.add('form-control');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${id}`;
        divAgregarCantidad.appendChild(inputCantidad);

        // Detectar el plato y la cantidad que se está agregando
        inputCantidad.onchange = () => {
            let cantidad = parseInt(inputCantidad.value);

            agregarPlato({ ...plato, cantidad });
        };

        row.appendChild(nombrePlato);
        row.appendChild(precioPlato);
        row.appendChild(categoriaPlato);
        row.appendChild(divAgregarCantidad);

        contenido.appendChild(row);
    });
}

function agregarPlato(producto) {
    // Extraer el pedido actual
    let { pedido } = cliente;

    // Revisar que la cantidad sea mayor que 0
    if (producto.cantidad > 0) {

        // Comprueba si el elemento ya existe en el array
        if (pedido.some(plato => plato.id === producto.id)) {
            // El artículo ya existe, se actualiza la cantidad
            const pedidoActualizado = pedido.map(plato => {
                if (plato.id === producto.id) {
                    plato.cantidad = producto.cantidad;
                }
                return plato;
            });

            // Asignamos el nuevo array de pedido al cliente
            cliente.pedido = [...pedidoActualizado];

        } else {
            // El plato no existe, se agrega al array de pedido
            cliente.pedido = [...pedido, producto];
        }
    } else {
        // Eliminar platos cuando la cantidad es 0
        const resultado = pedido.filter(plato => plato.id !== producto.id);

        cliente.pedido = [...resultado];
    }

    limpiarHTML();

    // Si hay algún plato en el pedido...
    if (cliente.pedido.length) {
        // Mostrar el resumen del pedido
        actualizarResumen();

    } else {
        mensajePedidoVacio();
    }
}

function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-4', 'px-4', 'shadow', 'mt-3');

    // Información de la mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');
    mesa.appendChild(mesaSpan);

    // Información de la hora
    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');
    hora.appendChild(horaSpan);

    // Título de la sección
    const heading = document.createElement('h3');
    heading.textContent = 'Platos Consumidos';
    heading.classList.add('my-4', 'text-center');

    // Iterar sobre el array de pedidos
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const { pedido } = cliente;

    pedido.forEach(plato => {
        const { nombre, cantidad, precio, id } = plato;

        const elemento = document.createElement('li');
        elemento.classList.add('list-group-item');

        // Nombre del plato
        const nombreElemento = document.createElement('h4');
        nombreElemento.classList.add('my-4');
        nombreElemento.textContent = nombre;

        // Cantidad del plato
        const cantidadElemento = document.createElement('p');
        cantidadElemento.classList.add('fw-bold');
        cantidadElemento.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;
        cantidadElemento.appendChild(cantidadValor);

        // Precio del plato
        const precioElemento = document.createElement('p');
        precioElemento.classList.add('fw-bold');
        precioElemento.textContent = 'Precio: ';

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `${precio} €`;
        precioElemento.appendChild(precioValor);

        // Subtotal del plato
        const subtotalElemento = document.createElement('p');
        subtotalElemento.classList.add('fw-bold');
        subtotalElemento.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);
        subtotalElemento.appendChild(subtotalValor);

        // Botón para eliminar plato del pedido
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger', 'mb-2');
        btnEliminar.textContent = 'Eliminar';

        btnEliminar.onclick = () => {
            eliminarPlato(id);
        }

        // Agregar hijos al elemento
        elemento.appendChild(nombreElemento);
        elemento.appendChild(cantidadElemento);
        elemento.appendChild(precioElemento);
        elemento.appendChild(subtotalElemento);
        elemento.appendChild(btnEliminar);

        // Agregar elemento al grupo 
        grupo.appendChild(elemento);
    });

    // Agregar hijos al resumen
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    // Mostrar formulario de propinas
    formularioPropinas();
}

function calcularSubtotal(precio, cantidad) {
    return `${precio * cantidad} €`;
}

function eliminarPlato(id) {
    Swal.fire({
        title: '¿Deseas eliminar este producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let { pedido } = cliente;

            const resultado = pedido.filter(plato => plato.id !== id);
            cliente.pedido = [...resultado];

            limpiarHTML();

            // Si hay algún plato en el pedido...
            if (cliente.pedido.length) {
                actualizarResumen();

            } else {
                mensajePedidoVacio();
            }

            // Regresar la cantidad a 0 del plato eliminado
            const productoEliminado = `#producto-${id}`;

            const inputEliminado = document.querySelector(productoEliminado);
            inputEliminado.value = 0;
        }
    });
}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido');

    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('div');
    texto.classList.add('text-center', 'my-2')
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);
}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('div');
    formulario.classList.add('col-md-5', 'formulario', 'mt-3');

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card', 'py-3', 'px-3', 'shadow');

    const heading = document.createElement('h3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    // Radio nada de propina
    const radioNadaDiv = document.createElement('div');
    radioNadaDiv.classList.add('form-check');

    const radioNada = document.createElement('input');
    radioNada.classList.add('form-check-input');
    radioNada.type = 'radio';
    radioNada.name = 'propina';
    radioNada.value = '0';
    radioNada.onclick = calcularPropina;

    const radioNadaLabel = document.createElement('label');
    radioNadaLabel.classList.add('form-check-label');
    radioNadaLabel.textContent = 'Nada';

    radioNadaDiv.appendChild(radioNada);
    radioNadaDiv.appendChild(radioNadaLabel);

    // Radio button 10%
    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check');

    const radio10 = document.createElement('input');
    radio10.classList.add('form-check-input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('label');
    radio10Label.classList.add('form-check-label');
    radio10Label.textContent = '10%';

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    // Radio button 25%
    const radio25Div = document.createElement('div');
    radio25Div.classList.add('form-check');

    const radio25 = document.createElement('input');
    radio25.classList.add('form-check-input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = '25';
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('label');
    radio25Label.classList.add('form-check-label');
    radio25Label.textContent = '25%';

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    // Radio button 50%
    const radio50Div = document.createElement('div');
    radio50Div.classList.add('form-check');

    const radio50 = document.createElement('input');
    radio50.classList.add('form-check-input');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = '50';
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('label');
    radio50Label.classList.add('form-check-label');
    radio50Label.textContent = '50%';

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);

    // // Agregar al div principal
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radioNadaDiv);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);

    // Agregar al formulario
    formulario.appendChild(divFormulario);

    contenido.appendChild(formulario);
}

function calcularPropina() {
    const { pedido } = cliente;
    let subtotal = 0;

    // Calcular el subtotal a pagar
    pedido.forEach(producto => {
        subtotal += producto.cantidad * producto.precio;
    });

    // Recoger el radio button de la propina del cliente
    const propinaSeleccionada = parseInt(document.querySelector('[name="propina"]:checked').value);

    // Calcular la propina
    const propina = ((subtotal * propinaSeleccionada) / 100);

    // Calcular el total a pagar
    const total = subtotal + propina;

    mostrarTotalHTML(subtotal, propina, total);
}

function mostrarTotalHTML(subtotal, propina, total) {
    const formulario = document.querySelector('.formulario');

    // Resumen de pago
    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar');

    // Subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-5');
    subtotalParrafo.textContent = 'Subtotal del consumo: ';

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `${subtotal} €`;

    subtotalParrafo.appendChild(subtotalSpan);

    // Propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fs-3', 'fw-bold', 'mt-3');
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `${propina} €`;

    propinaParrafo.appendChild(propinaSpan);

    // Total
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-3', 'fw-bold', 'mt-3');
    totalParrafo.textContent = 'Total a pagar: ';

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `${total} €`;

    totalParrafo.appendChild(totalSpan);

    // Eliminar el último resumen de pago
    const totalPagardiv = document.querySelector('.total-pagar');
    if (totalPagardiv) {
        totalPagardiv.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    formulario.appendChild(divTotales);
}