import { BASEURL, hideModal, allServicios } from '../../../js/index.js';
import { Carrito } from '../../../js/Classes/Carrito.js';
import { Servicio } from '../../../js/Classes/Servicio.js';

/**
 * Obtiene del servidor los carritos del usuario. 
 * En caso de tener alguno pendiente, cargará ese. De lo contrario, se creará uno nuevo.
 */
function obtenerCarritosUsuario() {
    let carrito, userID;

    userID = JSON.parse(localStorage.getItem('datosUsuario')).id;

    $.ajax({
        url: BASEURL + "user/" + userID + "/carrito/estado/0",
        type: "GET"
    })
        .done(response => {
            console.log("Carrito - compras pendientes del usuario", response);

            // Si hay algun carrito a mitad, lo guarda en el localStorage. Si no, crea uno nuevo.
            if (response.data.length != 0) {
                let comprasPendientes = response.data;
                console.log("El usuario tenía un carrito de compras pendientes. Éstas son las compras", comprasPendientes);

                transformDBtoLocalCart(comprasPendientes);
                carrito = getLocalShoppingCart();

            } else {
                console.log("El usuario no tenia compras pendientes", response.data);
                console.log("No hay ningún carrito pendiente en la BBDD. Vamos a revisar el localStorage.");

                if (localStorage.getItem('carrito') == null) {
                    console.log("No hay carrito en localStorage. Vamos a crear uno para el usuario");
                    carrito = new Carrito(userID);
                    guardarCarritoEnLocal(carrito);
                } else {
                    console.log("Sí que había un carrito en local. Ya está ahí así que no hacemos nada.");
                    carrito = getLocalShoppingCart();
                }
            }

            updateShoppingCartIcon(carrito);

        })
        .fail(response => {
            console.log("Carrito - ERROR en la petición de GET carrito según userID", response);
        });
}



/**
 * Actualiza el número de items en el icono del carro del menú superior
 */
function updateShoppingCartIcon(carrito) {
    $("#shopping-cart-icon").attr(
        "number-of-items",
        carrito.getCantidadServicios()
    );
}

/**
 * Rellena la div del carrito. Actualmente esta div está en una modal.
 */
function pintarCarrito(carrito) {
    if (carrito == null) {
        console.log("Carrito - no nos pasan carrito por parametro, cogemos de localStorage");
        carrito = getLocalShoppingCart();
    } else {
        console.log("Carrito - pintamos el carrito pasado por parametro", carrito);
    }

    // Vaciamos modal
    $("#my-shopping-cart").empty();

    // Mostramos contenido en función de si hay o no servicios
    if (carrito.getCantidadServicios() == 0) {
        showEmptyShoppingCart();
    } else {
        showFullShoppingCart(carrito);
    }
}

/**
 * Rellena la div de un carrito vacío
 */
function showEmptyShoppingCart() {
    let warning = $("<div/>").addClass("cart__warning");
    warning.text("¡Vaya! Aún no has comprado nada.");
    $("#my-shopping-cart").append(warning);
}

/**
 * Rellena la div de un carrito lleno
 */
function showFullShoppingCart(carrito) {
    // Declaramos una variable a modo de "plantilla"
    let itemHtml = "";
    itemHtml += '<div class="cart__column">';
    itemHtml +=
        '   <button id="btn-delete-xx" class="cart__button cart__button--transparent btn-delete">';
    itemHtml += '       <img src="assets/img/icons/delete.svg" alt="" />';
    itemHtml += "   </button>";
    itemHtml += "</div>";
    itemHtml += '<div class="cart__column">';
    itemHtml += '   <span class="item-description"></span>';
    itemHtml += "</div>";
    itemHtml += '<div class="cart__column cart__column--separated">';
    itemHtml += '   <button id="btn-minus-xx" class="cart__button btn-minus">';
    itemHtml += '       <img src="assets/img/icons/minus.svg" alt="" />';
    itemHtml += "   </button>";
    itemHtml += '   <span class="item-quantity"></span>';
    itemHtml += '   <button id="btn-plus-xx" class="cart__button btn-plus">';
    itemHtml += '       <img src="assets/img/icons/plus.svg" alt="" />';
    itemHtml += "   </button>";
    itemHtml += "</div>";
    itemHtml += '<div class="cart__column cart__column--price">';
    itemHtml += '   <span class="item-subtotal"></span>';
    itemHtml += "</div>";

    // Añadimos lista de diferentes servicios del carrito
    $.each(carrito.servicios, (index, s) => {
        // Creamos elemento (un servicio por fila)
        let item = $("<div/>", {
            class: "cart__item",
            id: "cart-item-" + s.id
        });

        // Rellenamos el item con la plantilla
        item.append(itemHtml);

        // Especificamos los campos propios del item
        $(item).find(".item-description").text(s.nombre);
        $(item).find(".item-quantity").text(s.unidades);
        $(item).find(".item-subtotal").text((s.unidades * s.precio).toFixed(2) + "€");

        // Cambiamos el ID de los botones por simplificar el onclick. Pero se podría hacer también accediendo a la div del item
        $(item).find("#btn-delete-xx").attr("id", "btn-delete-" + s.id);
        $(item).find("#btn-minus-xx").attr("id", "btn-minus-" + s.id);
        $(item).find("#btn-plus-xx").attr("id", "btn-plus-" + s.id);

        // Añadimos el item
        $("#my-shopping-cart").append(item);
    });

    // Añadimos fila de precio total
    $("#my-shopping-cart").append(
        $("<div/>")
            .addClass("cart__summary")
            .html(
                'TOTAL <span id="cart-total">' +
                carrito.calcularPrecioTotal().toFixed(2) +
                "</span> €"
            )
    );

    // Añadimos el botón de confirmar la compra
    $("#my-shopping-cart").append(
        $("<div/>")
            .addClass("cart__footer")
            .html(
                '<button class="button" id="btn-confirmarCompra">Confirmar compra</button>'
            )
    );
}

/**
 * Añade listeners de eventos onclick a los botones de dentro del carrito
 * a) Botones pequeños de borrar todos, restar uno y sumar uno
 * b) Botón de confirmar compra: forma parte de la misma <div> (en vez de depender del modal)
 *    por si se decidiera sacarlo del modal (y ponerlo simplemente en contenido)
 */
function setListenersShoppingCart() {

    $("#my-shopping-cart").on("click", "#btn-confirmarCompra", function (event) {
        guardarCarritoFinalizadoEnBBDD();
    });

    $("#my-shopping-cart").on("click", ".btn-delete", function (event) {
        let carrito, idServicio;

        carrito = getLocalShoppingCart();
        idServicio = event.currentTarget.id.split("-").reverse()[0];
        // Si necesitásemos acceder a la div del item, se haría así:
        // let idServicio = $(this).parent().parent()[0].id.split('-').reverse()[0];

        carrito.borrarServicio(idServicio);
        guardarCarritoEnLocal(carrito);
        pintarCarrito(carrito);
        updateShoppingCartIcon(carrito);
        /*guardarCarritoPendienteEnBBDD();*/
    });

    $("#my-shopping-cart").on("click", ".btn-minus", function (event) {
        let carrito, idServicio;

        carrito = getLocalShoppingCart();
        idServicio = event.currentTarget.id.split("-").reverse()[0];

        carrito.restarServicio(idServicio);
        guardarCarritoEnLocal(carrito);
        pintarCarrito(carrito);
        updateShoppingCartIcon(carrito);
        /*guardarCarritoPendienteEnBBDD()*/
    });

    $("#my-shopping-cart").on("click", ".btn-plus", function (event) {
        let carrito, idServicio;

        carrito = getLocalShoppingCart();
        idServicio = event.currentTarget.id.split("-").reverse()[0];

        carrito.sumarServicio(idServicio);
        guardarCarritoEnLocal(carrito);
        pintarCarrito(carrito);
        updateShoppingCartIcon(carrito);
        /*guardarCarritoPendienteEnBBDD();*/
    });
}

/**
 * Guarda el carrito en el local storage.
 * Ojo: el carrito local tiene toda la información de los servicios.
 */
function guardarCarritoEnLocal(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    console.log("localStorage - actualizado el carrito: ", localStorage.getItem('carrito'));
}


/*function actualizarCarritoPendienteEnBBDD() {
    let carrito, serviciosIngresarBBDD, compraJson;
    carrito = getLocalShoppingCart();

    // Creamos un objeto json con la información de los servicios adquiridos para almacenar en la BBDD. 
    serviciosIngresarBBDD = [];

    $.each(carrito.servicios, (index, s) => {
        let info = {
            "id": s.id,
            "cant": s.unidades
        };

        serviciosIngresarBBDD.push(info);
    });

    compraJson = {
        user_id: carrito.userID,
        estado: 0, // compra a mitad
        servicios: JSON.stringify(serviciosIngresarBBDD)
    };

    console.log("Carrito - Datos a pasar por POST", JSON.stringify(compraJson));

    $.ajax({
        url: BASEURL + "carrito",  //TODO carrito/{carrito}
        type: "PATCH",
        contentType: "application/json",
        data: JSON.stringify(compraJson)
    })
        .done(response => {
            console.log("Carrito - OK, actualización de carrito insertada correctamente", response);
            updateShoppingCartIcon(carrito);
        })
        .fail(response => {
            console.log("Carrito - ERROR al insertar la actualización de compra pendiente", response);
        });
}
*/

function guardarCarritoFinalizadoEnBBDD() {
    let carrito, serviciosIngresarBBDD, compraJson;
    carrito = getLocalShoppingCart();

    // Creamos un objeto json con la información de los servicios adquiridos para almacenar en la BBDD. 
    serviciosIngresarBBDD = [];

    $.each(carrito.servicios, (index, s) => {
        let info = [s.id, s.unidades];

        serviciosIngresarBBDD.push(info);
    });
    console.log("estos son los servicios a ingresar", serviciosIngresarBBDD);

    compraJson = {
        user_id: carrito.userID,
        estado: 1, // 1 porque le han dado a confirmar compra.
        servicios: serviciosIngresarBBDD
        //servicios: JSON.stringify(serviciosIngresarBBDD)
    };

    console.log("Carrito - Datos a pasar por POST", JSON.stringify(compraJson));

    $.ajax({
        url: BASEURL + "carrito",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(compraJson)
    })
        .done(response => {
            if (response.status == 409) {
                console.log("Carrito - error interno al comprar. Se debe hacer un PUT al carrito pendiente. Podemos averiguar la ID de laguna formay guardarla en el localstorage a una mala");
                alert("error compra 409");
            } else {
                console.log("Carrito - OK, compra insertada correctamente", response);

                // Cerramos el modal
                hideModal("modal-shopping-cart");

                // Avisamos del éxito al usuario //REVIEW poner algo más bonito
                alert("Tu compra se ha completado correctamente :)");

                // Limpiamos el carrito
                carrito.limpiarServicios();
                guardarCarritoEnLocal(carrito);
                updateShoppingCartIcon(carrito);
            }
        })
        .fail(response => {
            // Avisamos del error al usuario
            alert("Vaya! Ha habido un error con tu compra. Nos pondremos en contacto contigo.")
            console.log("Carrito - ERROR al insertar la compra", response);
        });
}

/**
 * Transforma el carrito del localStorage a un objeto (usando el método estático de Carrito)
 */
function getLocalShoppingCart() {
    let carritoJson, carritoObjeto;

    carritoJson = JSON.parse(localStorage.getItem('carrito'));
    console.log("getLocalShoppingCart - JSON carrito del localStorage", carritoJson);

    carritoObjeto = Carrito.fromJson(carritoJson);
    console.log("getLocalShoppingCart - objeto Carrito que nos da la static", carritoObjeto);

    return carritoObjeto;
}


function transformDBtoLocalCart(comprasPendientes) {
    let idCarritoPendiente;
    console.log("transformDBtoLocalCart", comprasPendientes);

    // La API nos devuelve un array con todas las compras pendientes. Cada elemento incluye la ID del carrito (que es la misma en todas)
    idCarritoPendiente = comprasPendientes[0].cart_id;
    console.log("ID DEL CARRITO PENDIENTE", idCarritoPendiente);
    localStorage.setItem('idCarritoPendiente', idCarritoPendiente);


    let userID = JSON.parse(localStorage.getItem('datosUsuario')).id;
    let carrito = new Carrito(userID);

    $.each(comprasPendientes, function (index, compra) {
        console.log("Procesando compra", compra);
        let nuevoServicio = new Servicio(compra.id, compra.nombre, compra.categoria_id, compra.precio, compra.imagen, compra.descripcion, compra.unidades);
        carrito.addServicio(nuevoServicio);
    });

    // Guardamos ID del carrito por si luego tenemos que modificarlo con PUT/PATCH
    guardarCarritoEnLocal(carrito);

}


// Exportamos nuestras funciones externas para usarlas desde index.js
export { getLocalShoppingCart, guardarCarritoEnLocal, guardarCarritoFinalizadoEnBBDD, updateShoppingCartIcon, pintarCarrito, setListenersShoppingCart, obtenerCarritosUsuario };