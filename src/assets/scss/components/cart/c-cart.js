const $baseURL = "http://localhost/api/public/api/";

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
function setListenersShoppingCart(carrito) {
    //TODO Cambiar cuando esté la nueva estructura BBDD para que no inserte X registros sin relacionar haciendo X peticiones AJAX.
    $("#my-shopping-cart").on("click", "#btn-confirmarCompra", function (event) {
        $.each(carrito.servicios, (index, s) => {
            let serviceID = s.id;

            for (let i = 1; i <= s.unidades; i++) {

                let compraJson = {
                    servicio_id: serviceID,
                    user_id: carrito.userID,
                    tipo: "compra"
                };

                $.ajax({
                    url: $baseURL + "compra",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(compraJson)
                })
                    .done(response => {
                        console.log("OK, compra insertada correctamente", response);
                    })
                    .fail(response => {
                        console.log("ERROR al insertar la compra", response);
                    });
            }
        });
    });

    $("#my-shopping-cart").on("click", ".btn-delete", function (event) {
        let idServicio = event.currentTarget.id.split("-").reverse()[0];
        // Si necesitásemos acceder a la div del item, se haría así:
        // let idServicio = $(this).parent().parent()[0].id.split('-').reverse()[0];

        carrito.borrarServicio(idServicio);
        pintarCarrito(carrito);
        updateShoppingCartIcon(carrito);
    });

    $("#my-shopping-cart").on("click", ".btn-minus", function (event) {
        let idServicio = event.currentTarget.id.split("-").reverse()[0];

        carrito.restarServicio(idServicio);
        pintarCarrito(carrito);
        updateShoppingCartIcon(carrito);
    });

    $("#my-shopping-cart").on("click", ".btn-plus", function (event) {
        let idServicio = event.currentTarget.id.split("-").reverse()[0];

        carrito.sumarServicio(idServicio);
        pintarCarrito(carrito);
        updateShoppingCartIcon(carrito);
    });
}

// Exportamos nuestras funciones externas para usarlas desde index.js
export { updateShoppingCartIcon, pintarCarrito, setListenersShoppingCart };
