function pintarCategorias() {
    $baseURL = "http://localhost/api/public/api/";

    $.ajax({
        url: $baseURL + "categoria",
        type: "GET",
        dataType: "json"
    })
        .done(
            function (respuesta) {
                if (respuesta.status >= 200 && respuesta.status <= 299) {
                    pintarItemsSidebar(respuesta.data);
                    setListenersItemsSidebar();
                } else {
                    alert("ERROR al obtener datos: " + respuesta.status + "(" + respuesta.code + "). Revisar si hay datos en la BBDD");
                    console.log("ERROR al obtener datos. Hay que revisar que haya datos en la BBDD.", respuesta);
                }
            })
        .fail(function (xhr) {
            alert("ERROR del servidor: " + xhr.status + "(" + xhr.statusText + ")");
        })
}

function pintarItemsSidebar(categorias) {
    $.each(categorias, function (index, categoria) {
        // Creamos elemento del menú
        let item = $('<div/>', {
            "class": "c-sidebar__item",
            "id": "cat-" + categoria.id,
            "text": categoria.nombre
        });
        // Lo añadimos
        $("#c-sidebar").append(item);
    })
}

function setListenersItemsSidebar() {
    // Listener en el menú que afectará a todos los items (habidos y nuevos)
    $("#c-sidebar").on("click", ".c-sidebar__item", function () {
        alert("En el siguiente sprint verás la categoría " + $(this)[0].id);
    })
}