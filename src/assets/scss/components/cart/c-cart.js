// ======================================================================
//      IMPORT
// ======================================================================
import { BASEURL, hideModal } from '../../../js/index.js';
import { Carrito } from '../../../js/Classes/Carrito.js';
import { Servicio } from '../../../js/Classes/Servicio.js';

// ======================================================================
//      Pintar interfaz
// ======================================================================
/**
 * Actualiza el número de items en el icono del carro del menú superior
 */
function updateShoppingCartIcon() {
    let carrito;

    carrito = getLocalShoppingCart();

    $("#shopping-cart-icon").attr(
        "number-of-items",
        carrito.getCantidadServicios()
    );
}

/**
 * Rellena la div del carrito. Actualmente esta div está en una modal.
 */
function pintarCarritoEnSuCapa() {
    let carrito;

    carrito = getLocalShoppingCart();

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
    let warning;

    warning = $("<div/>");
    warning.addClass("cart__warning");
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
            .html('TOTAL <span id="cart-total">' + carrito.calcularPrecioTotal().toFixed(2) + "</span> €")
    );

    // Añadimos el botón de confirmar la compra
    $("#my-shopping-cart").append(
        $("<div/>")
            .addClass("cart__footer")
            .html('<button class="button" id="btn-confirmarCompra">Confirmar compra</button>')
    );
}

// ======================================================================
//      Listeners y eventos
// ======================================================================
/**
 * Añade listeners de eventos onclick a los botones de dentro del carrito
 * a) Botones pequeños de borrar todos, restar uno y sumar uno
 * b) Botón de confirmar compra: forma parte de la misma <div> (en vez de depender del modal)
 *    por si se decidiera sacarlo del modal (y ponerlo simplemente en contenido)
 */
function setListenersShoppingCart() {

    $("#my-shopping-cart").on("click", "#btn-confirmarCompra", function (event) {
        patchCarrito(1);
    });

    $("#my-shopping-cart").on("click", ".btn-delete", function (event) {
        let carrito, idServicio;

        carrito = getLocalShoppingCart();
        idServicio = event.currentTarget.id.split("-").reverse()[0];

        carrito.borrarServicio(idServicio);
        guardarCarrito(carrito);
        pintarCarritoEnSuCapa();
    });

    $("#my-shopping-cart").on("click", ".btn-minus", function (event) {
        let carrito, idServicio;

        carrito = getLocalShoppingCart();
        idServicio = event.currentTarget.id.split("-").reverse()[0];

        carrito.restarServicio(idServicio);
        guardarCarrito(carrito);
        pintarCarritoEnSuCapa();
    });

    $("#my-shopping-cart").on("click", ".btn-plus", function (event) {
        let carrito, idServicio;

        carrito = getLocalShoppingCart();
        idServicio = event.currentTarget.id.split("-").reverse()[0];

        carrito.sumarServicio(idServicio);
        guardarCarrito(carrito);
        pintarCarritoEnSuCapa();
    });
}

// ======================================================================
//      Guardado del carrito
// ======================================================================
/**
 * Guarda el carrito en local y después en remoto.
 * Además, actualiza el icono del menú superior.
 */
function guardarCarrito(carrito) {
    guardarCarritoEnLocal(carrito);
    guardarCarritoEnRemoto();
}

/**
 * Guarda el carrito en el local storage y actualiza el icono
 */
function guardarCarritoEnLocal(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    console.log("localStorage - actualizado el carrito: ", JSON.parse(localStorage.getItem('carrito')));
    updateShoppingCartIcon();
}

/**
 * Guarda el carrito local en remoto. En función de si hay un carrito pendiente o no, 
 * redirige a una función de crear nuevo carrito o actualizarlo.
 */
function guardarCarritoEnRemoto() {
    let idCarritoPendiente;

    idCarritoPendiente = localStorage.getItem("idCarritoPendiente");

    if (idCarritoPendiente == null) {
        console.log("Carrito - no nos consta ningún carrito pendiente. Haremos POST");
        postCarrito();
    } else {
        console.log("Carrito - existe un carro pendiente:", idCarritoPendiente, ". Haremos PUT/PATCH");
        patchCarrito(0);
    }
}

// ======================================================================
//      Transformación del formato del carrito
// ======================================================================
/**
 * Transforma el carrito del localStorage a un objeto (usando el método estático de Carrito)
 */
function getLocalShoppingCart() {
    let carritoJson, carritoObjeto;

    carritoJson = JSON.parse(localStorage.getItem('carrito'));

    carritoObjeto = Carrito.fromJson(carritoJson);

    console.log("getLocalShoppingCart - transformado este JSON", carritoJson, " en este objeto Carrito ", carritoObjeto);

    return carritoObjeto;
}

/**
 * Transforma el array de compras pendientes que recibe de la API en un objeto Carrito.
 */
function transformDBtoLocalCart(comprasPendientes) {
    let idCarritoPendiente, userID, carrito;

    // La API devuelve un array con todas las compras pendientes. Cada elemento incluye la ID del carrito (que es la misma en todas)
    idCarritoPendiente = comprasPendientes[0].cart_id;

    console.log("Guardamos en localStorage el carrito pendiente, con id=", idCarritoPendiente);
    localStorage.setItem('idCarritoPendiente', idCarritoPendiente);


    userID = JSON.parse(localStorage.getItem('datosUsuario')).id;
    carrito = new Carrito(userID);

    $.each(comprasPendientes, function (index, compra) {
        console.log("Procesando compra", compra, "con unidades", compra.unidades);
        let nuevoServicio = new Servicio(compra.id, compra.nombre, compra.categoria_id, compra.precio, compra.imagen, compra.descripcion, compra.unidades);
        console.log("servicio creado", nuevoServicio);
        carrito.addServicio(nuevoServicio);
    });

    // Guardamos el carrito en local
    guardarCarritoEnLocal(carrito);
}

// ======================================================================
//      Peticiones AJAX del carrito
// ======================================================================
/**
 * Almacena mediante una petición POST un carrito pendiente en el servidor.
 */
function postCarrito() {
    let myData;

    myData = montarDataDelCarritoParaAJAX(0);

    $.ajax({
        url: BASEURL + "carrito",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(myData)
    }).done(function (response) {
        switch (response.status) {
            case 200:
                console.log("postCarrito - OK, carrito creado en BBDD", response);
                localStorage.setItem("idCarritoPendiente", response.data.cartData.id);
                break;
            case 409:
                console.log("postCarrito - ERROR inesperado POST 409: el usuario ya tenía carrito pendiente. No se debería llegar aquí.", response);
                break;
            default:
                console.log("postCarrito - ERROR no contemplado", response);
        }
    }).fail(function (error) {
        console.log("postCarrito - ERROR del servidor", error);
    });
}

/**
 * Elimina un carrito (cuya ID recibe por parámetro) de la BBDD. 
 * Actualmente solo se usa para borrar carritos pendientes que han sido vaciados por el usuario.
 */
function deleteCarrito(idCarrito) {
    console.log("deleteCarrito - Vamos a borrar el carrito " + idCarrito + ". Ha sido vaciado sin comprar, así que no tiene sentido que esté.");
    $.ajax({
        type: "DELETE",
        url: BASEURL + "carrito/" + idCarrito
    }).done(function (response) {
        switch (response.status) {
            case 200:
                console.log("deleteCarrito - OK, carrito borrado de la BBDD", response);
                break;
            case 404:
                console.log("deleteCarrito - ERROR, el carrito no se ha encontrado", response);
                break;
            default:
                console.log("deleteCarrito - ERROR desconocido al intentar borrar carrito", response);
        }
    }).fail(function (error) {
        console.log("deleteCarrito - ERROR al borrar carrito de la BBDD", error);
    }).always(function () {
        localStorage.removeItem("idCarritoPendiente");
    });
}

/**
 * Actualiza en la BBDD el carrito pendiente.
 * Recibe por parámetro el nuevo estado del carrito (0: sigue pendiente, 1: compra confirmada)
 */
function patchCarrito(estado) {
    let myData, idCarritoPendiente;

    myData = montarDataDelCarritoParaAJAX(estado);
    idCarritoPendiente = localStorage.getItem("idCarritoPendiente");

    $.ajax({
        url: BASEURL + "carrito/" + idCarritoPendiente,
        type: "PATCH",
        contentType: "application/json",
        data: JSON.stringify(myData)
    }).done(function (response) {
        switch (response.code) {
            case 200:
                console.log("patchCarrito - OK, carrito actualizado correctamente en BBDD", response);

                if (estado === 1) { // Si se trataba de una compra confirmada... 
                    gestionarCompraExitosa();
                }

                if (myData.servicios.length == 0) { // Si han ido vaciando el carrito, borramos el registro de la BBDD (la API borra de "carrito_servicio" pero no de "carritos")
                    deleteCarrito(idCarritoPendiente);
                }

                break;
            case 409:
                console.log("patchCarrito - ERROR inesperado PUT/PATCH 409: el carrito objetivo ya estaba confirmado (estado 1). No se debería llegar aquí.", response);
                break;
            default:
                console.log("patchCarrito - ERROR no contemplado", response);
        }
    }).fail(function (response) {
        console.log("patchCarrito - ERROR al actualizar el carrito", response);
        if (estado === 1) {
            alert("Vaya! Ha habido un error al confirmar tu compra. Nos pondremos en contacto contigo.");
        }
    });
}

/**
 * Establece el carrito actual del usuario. 
 * Si tiene compras pendientes en la BBDD, usará ese. 
 * De lo contrario, mirará si hay algo en localStorage (por si se decide implementar que pueda comprar aunque no tenga la sesión abierta)
 * Si tampoco hay datos en localStorage, creará un carrito nuevo.
 */
function establecerCarritoActual() {
    let userID;

    userID = JSON.parse(localStorage.getItem('datosUsuario')).id;

    $.ajax({
        url: BASEURL + "user/" + userID + "/carrito/estado/0",
        type: "GET"
    }).done(function (response) {
        console.log("establecerCarritoActual - OK, respuesta del servidor", response);

        if (response.data.length != 0) {
            let comprasPendientes = response.data;
            console.log("establecerCarritoActual - El usuario tenía compras pendientes:", comprasPendientes);

            transformDBtoLocalCart(comprasPendientes);
        } else {
            console.log("establecerCarritoActual - El usuario no tiene compras pendientes en la BBDD", response.data);

            // Borrar información residual. Si no se toca la BBDD a pelo, no hace falta. Dejamos el código por si acaso.
            if (localStorage.getItem("idCarritoPendiente") != null) {
                localStorage.removeItem("idCarritoPendiente");
            }

            // Comprobar datos localStorage
            if (localStorage.getItem('carrito') == null) {
                console.log("establecerCarritoActual - No hay carrito en localStorage. Crearemos uno nuevo para el usuario");
                let carrito = new Carrito(userID);
                guardarCarritoEnLocal(carrito);
            } else {
                console.log("establecerCarritoActual - Sí que había un carrito en local. Usaremos ése.");
                updateShoppingCartIcon();
            }
        }
    }).fail(function (response) {
        console.log("Carrito - ERROR en la petición de GET carrito según userID", response);
    });
}

// ======================================================================
//      Funciones auxiliares para peticiones AJAX
// ======================================================================
/**
 * Monta y devuelve el objeto JSON para pasar como "data" en la petición AJAX. 
 * Los datos se obtienen del carrito del localStorage.
 * Por parámetro recibe el estado del carrito en la nueva petición (0-pendiente; 1-confirmado)
 */
function montarDataDelCarritoParaAJAX(estado) {
    let carrito, myData, serviciosIngresarBBDD;

    // 1. Obtenemos el objeto carrito
    carrito = getLocalShoppingCart();

    // 2. Preparamos el array de servicios con el formato adaptado a la API
    serviciosIngresarBBDD = [];
    $.each(carrito.servicios, (index, s) => {
        serviciosIngresarBBDD.push([s.id, s.unidades]);
    });

    // 3. Montamos el JSON
    myData = {
        "user_id": carrito.userID,
        "estado": estado,
        "servicios": serviciosIngresarBBDD
    };

    return myData;
}

/**
 * Gestiona qué hacer cuando la compra ha ido bien.
 */
function gestionarCompraExitosa() {
    let carrito;

    // Cerramos el modal
    hideModal("modal-shopping-cart");

    // Avisamos del éxito al usuario //REVIEW poner algo más bonito
    alert("Tu compra se ha completado correctamente :)");

    // Limpiamos el carrito
    carrito = getLocalShoppingCart();
    carrito.limpiarServicios();
    guardarCarritoEnLocal(carrito);
    localStorage.removeItem("idCarritoPendiente");
}

// ======================================================================
//      EXPORT
// ======================================================================
export { getLocalShoppingCart, guardarCarrito, pintarCarritoEnSuCapa, setListenersShoppingCart, establecerCarritoActual };