'use strict'

/*
    APIs usadas en el proyecto:

    - 1: https://www.themealdb.com/api/json/v1/1/categories.php
    - 2: https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef
    - 3: https://themealdb.com/api/json/v1/1/lookup.php?i=52772
*/

document.addEventListener('DOMContentLoaded', iniciarApp); 

function iniciarApp() {
    const resultado = document.querySelector('#resultado');
    const selectCategorias = document.querySelector('#categorias');

    if(selectCategorias) { // Evitar que de errores en la página de Favoritos
        selectCategorias.addEventListener('change', seleccionarCategoria);

        obtenerCategorias();
    }

    const favoritosDiv = document.querySelector('.favoritos');

    if(favoritosDiv) { // Evitar que de errores en la página Inicio
        obtenerFavoritos();
    }

    const modal = new bootstrap.Modal('#modal', {});

    function obtenerCategorias() {
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';

        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarCategorias(resultado.categories));
    }

    function mostrarCategorias(categorias) {
        categorias.forEach(categoria => {

            const { strCategory } = categoria;
            
            const option = document.createElement('option');
            option.value = strCategory;

            const textoOption = document.createTextNode(strCategory);
            option.append(textoOption);

            selectCategorias.appendChild(option);
        });
    }

    function seleccionarCategoria(e) {
        const categoria = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;

        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetas(resultado.meals))
    }

    function mostrarRecetas(recetas) {
        limpiarHTML(resultado);

        const heading = document.createElement('h2');
        heading.classList.add('text-center', 'text-black', 'my-5');
        heading.textContent = recetas.length ? recetas.length + ' Resultados Obtenidos' : 'No hay Resultados';

        resultado.appendChild(heading);

        // Iterar los resultados
        recetas.forEach(receta => {

            // Extraer contenidos
            const { idMeal, strMeal, strMealThumb } = receta;

            // Crear la card de la receta
            const recetaContenedor = document.createElement('div');
            recetaContenedor.classList.add('col-md-4');

            const recetaCard = document.createElement('div');
            recetaCard.classList.add('card', 'mb-4');

            const recetaImagen = document.createElement('img');
            recetaImagen.classList.add('card-img-top');
            recetaImagen.src = strMealThumb ?? receta.img;
            recetaImagen.alt = `Imagen de la receta ${strMeal ?? receta.titulo}`;

            const recetaCardbody = document.createElement('div');
            recetaCardbody.classList.add('card-body');

            const recetaHeading = document.createElement('h3');
            recetaHeading.classList.add('card-title', 'mb-3');
            recetaHeading.textContent = strMeal ?? receta.titulo;

            const recetaButton = document.createElement('button');
            recetaButton.classList.add('btn', 'btn-danger', 'w-100');
            recetaButton.onclick = () => {
                seleccionarReceta(idMeal ?? receta.id);
            }

            const textoRecetaButton = document.createTextNode('Ver receta');
            recetaButton.append(textoRecetaButton);
            
            // Inyectar en el código HTML
            recetaCardbody.appendChild(recetaHeading);
            recetaCardbody.appendChild(recetaButton);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardbody);

            recetaContenedor.appendChild(recetaCard);

            resultado.appendChild(recetaContenedor);
        });
    }

    function seleccionarReceta(id) {
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetaModal(resultado.meals[0]));
            
    }

    function mostrarRecetaModal(receta) {

        const { idMeal, strInstructions, strMeal, strMealThumb } = receta;

        // Añadir contenido al modal
        const modalTitle = document.querySelector('.modal .modal-title');
        limpiarHTML(modalTitle);

        const modalBody = document.querySelector('.modal .modal-body');

        const textModalTitle = document.createTextNode(strMeal);
        modalTitle.appendChild(textModalTitle);

        modalBody.innerHTML = `
            <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}"/>
            <h3 class="my-4">Instrucciones</h3>
            <p>${strInstructions}</p>
            <h3 class="my-4">Ingredientes y Cantidades</h3>
        `;

        const listGroup = document.createElement('ul');
        listGroup.classList.add('list-group');

        // Mostrar cantidades e ingredientes
        for(let i = 1; i <= 20; i++) {
            if(receta[`strIngredient${i}`]) {
               const ingrediente = receta[`strIngredient${i}`];
               const cantidad = receta[`strMeasure${i}`];

               const ingredienteLi = document.createElement('li');
               ingredienteLi.classList.add('list-group-item');
               
               const textoIngredienteLi = document.createTextNode(`${ingrediente} - ${cantidad}`);
               ingredienteLi.append(textoIngredienteLi);

               listGroup.appendChild(ingredienteLi);
            }
        }

        modalBody.appendChild(listGroup);

        const modalFooter = document.querySelector('.modal-footer');
        limpiarHTML(modalFooter);

        // Botones de favorito y cerrar
        const btnFavorito = document.createElement('button');
        btnFavorito.classList.add('btn', 'btn-danger', 'col');
        btnFavorito.textContent = existeRecetaEnStorage(idMeal) ? 'Eliminar Favorito' : 'Guardar Favorito';


        // Almacenar en LocalStorage
        btnFavorito.onclick = () => {

            // Comprobar si la receta ya existe en LocalStorage
            if(existeRecetaEnStorage(idMeal)) {
                eliminarFavorito(idMeal);
                btnFavorito.textContent = 'Guardar Favorito';
                mostrarToast('Eliminado correctamente');
                return;
            }

            agregarFavorito({
                id: idMeal,
                titulo: strMeal,
                img: strMealThumb
            });
            btnFavorito.textContent = 'Eliminar Favorito';
            mostrarToast('Agregado correctamente');
        }

        const btnCerrarModal = document.createElement('button');
        btnCerrarModal.classList.add('btn', 'btn-secondary', 'col');
        btnCerrarModal.onclick = () => {
            modal.hide(); // Ocultar el modal
        }

        const textoBtnCerrarModal = document.createTextNode('Cerrar');
        btnCerrarModal.appendChild(textoBtnCerrarModal);

        modalFooter.appendChild(btnFavorito);
        modalFooter.appendChild(btnCerrarModal);

        // Mostrar el modal
        modal.show();
    }

    function agregarFavorito(receta) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? []; // Si favoritos aún no existe, tendrá de valor un array vacío
    
        localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta]));  

        if(window.location.href.includes('favoritos')) { // Si el usuario se encuentra en la pagína de favoritos, vuelve a refrescar los resultados
            obtenerFavoritos();
        }
    }

    function eliminarFavorito(id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];

        const nuevosFavoritos = favoritos.filter(favorito => favorito.id !== id);
        localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));

        if(favoritosDiv) {
            mostrarRecetas(nuevosFavoritos);
        }
    }

    function existeRecetaEnStorage(id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];

        return favoritos.some(favorito => favorito.id === id);
    }

    function mostrarToast(mensaje) {
        const toastDiv = document.querySelector('#toast');
        const toastBody = document.querySelector('.toast-body');
        const toast = new bootstrap.Toast(toastDiv);

        toastBody.textContent = mensaje;
        toast.show();
    }

    function obtenerFavoritos() {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];

        // Si hay al menos un favorito
        if(favoritos.length) {
            mostrarRecetas(favoritos);
            return;
        }

        const noFavoritos = document.createElement('p');
        noFavoritos.textContent = 'No hay favoritos agregados';
        noFavoritos.classList.add('fs-4', 'text-center', 'font-bold', 'mt-5');

        favoritosDiv.appendChild(noFavoritos);
    }

    function limpiarHTML(selector) {
        // Limpiar el HTML del selector pasado por parámetro
        while(selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    }
}