'use strict'

// Variables
const formulario = document.querySelector('#agregar-gasto');
const btnFormulario = document.querySelector('#agregar-gasto button[type="submit"]');
const gastoListado = document.querySelector('#gastos ul');

// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        // Calcular 25%
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');

            // Calcular 50%
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');

        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Si el total es 0 o menor...
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

            btnFormulario.classList.add('disabled');
            btnFormulario.disabled = true;

        } else {
            btnFormulario.classList.remove('disabled');
            btnFormulario.disabled = false;
        }
    }

    eliminarGasto(id) {
        // Eliminamos del array el gasto que tenga ese id
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);

        // Mostramos los gastos restantes en el HTML
        ui.mostrarGastos(this.gastos);

        // Calculamos el restante
        this.calcularRestante();

        // Actualizamos el dinero restante
        ui.actualizarRestante(this.restante);

        // Comprobamos el presupuesto
        this.comprobarPresupuesto(this.presupuesto);
    }
}

class UI {
    insertarPresupuesto(presupuestoUsuario) {
        // Extraer los valores
        const { presupuesto, restante } = presupuestoUsuario;

        // Agregar al HTML
        document.querySelector('#total').textContent = presupuesto.toFixed(2) + ' €';
        document.querySelector('#restante').textContent = presupuesto.toFixed(2) + ' €';
    }

    imprimirAlerta(mensaje, tipo) {
        // Si ya existe una alerta de error, la eliminamos
        if (document.querySelector('.alerta-error')) {
            document.querySelector('.alerta-error').remove();
        }

        // Crear el div del mensaje
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger', 'alerta-error');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Agregar el mensaje
        const textoDivMensaje = document.createTextNode(mensaje);
        divMensaje.append(textoDivMensaje);

        // Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        // Eliminar el mensaje después de tres segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos) {
        // Elimina el HTML previo
        this.limpiarHTML();

        // Iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            // Crear un elemento li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id; // Crea un atributo data-id = "id";

            // HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill bg-primary p-2">${cantidad} €</span>`;

            // Botín para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');

            const textoBtnBorrar = document.createTextNode('Borrar');
            btnBorrar.append(textoBtnBorrar);

            btnBorrar.onclick = () => {
                presupuesto.eliminarGasto(id);
            }

            nuevoGasto.appendChild(btnBorrar);

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante.toFixed(2) + ' €';
    }
}

// Instancias
const ui = new UI();
let presupuesto;

// Funciones
// Preguntar presupuesto al usuario
async function preguntarPresupuesto() {

    const { value: presupuestoUsuario } = await Swal.fire({
        title: 'Introduce tu presupuesto',
        input: 'text',
        inputPlaceholder: 'Cantidad en Euros',
        confirmButtonColor: "#003771",
        confirmButtonText: "Confirmar",
    });

    if (presupuestoUsuario) {
        Swal.fire({
            title: `Tu presupuesto es de ${presupuestoUsuario} €`,
            confirmButtonColor: "#003771",
            confirmButtonText: "Confirmar",
        });
    }

    // Validación del presupuesto
    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        await Swal.fire({
            title: `El presupuesto no es válido`,
            confirmButtonColor: "#003771",
            confirmButtonText: "Volver",
        });

        // Recargar la ventana actual
        window.location.reload();
        return;
    }

    // Presupuesto válido
    presupuesto = new Presupuesto(presupuestoUsuario);

    // Mostramos el presupuesto en la interfaz
    ui.insertarPresupuesto(presupuesto);
}

// Añadir gastos
function agregarGasto(e) {
    e.preventDefault();

    // Leemos los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if (nombre.trim() === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;

    } else if (isNaN(cantidad) || cantidad <= 0) {
        ui.imprimirAlerta('La cantidad no es válida', 'error');
        return;
    }

    // Generamos un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() };

    // Añadimos un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // Mostramos alerta de éxito
    ui.imprimirAlerta('Gasto agregado correctamente');

    // Imprimimos los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    // Actualizamos el dinero restante
    ui.actualizarRestante(restante);

    // Comprobamos el presupuesto
    presupuesto.comprobarPresupuesto(presupuesto);

    // Reiniciamos el formulario
    formulario.reset();
}
