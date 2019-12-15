import { informacion, volver } from '../scss/components/asistente/animation.js';

let categorias;
let imagenesCarrusel;

const $baseURL = "http://localhost/api/public/api/";

let peticionCategorias = $.ajax({
                                    url : $baseURL + 'categoria',
                                    method : 'GET',
                                    dataType: 'json'
                                });

let peticionCarrusel = $.ajax({
                                    url: $baseURL + 'carrusel',
                                    type: "GET",
                                    dataType: "json"
                                });

$(function(){
    $.when( peticionCategorias, peticionCarrusel )
    .done(function(respuestaCategoria, respuestaCarrusel){        
        categorias = respuestaCategoria[0];
        imagenesCarrusel = respuestaCarrusel[0];
        
        cargarCartas();
        pintarItemsSidebar();
        getImgCarrusel();

        informacion();
        volver();
    });
})

function cargarCartas() {

    $.each(categorias.data, function(index, element){

        let areaColumna = $('<div>').addClass('l-columns__area');

        let componenteCard = $('<div>').addClass('c-card');

        let cardImg = $('<img>').attr('src', './assets/img/cartas/'+element.imagen).addClass('c-card__img');

        let cardContenido = $('<div>').addClass('c-card__content');
        let cardTitulo = $('<h2>').addClass('c-card__title').append(element.nombre);
        let cardDescripcion = $('<h2>').addClass('c-card__text').append(element.descripcion);
        cardContenido.append(cardTitulo);
        cardContenido.append(cardDescripcion);

        let cardBoton = $('<div>').addClass('c-card__button').attr('id', 'cat-'+element.id);
        let linkBoton = $('<a>').addClass('c-card__link').append('Leer Más');
        cardBoton.append(linkBoton);
        
        setListenerCartasBoton(cardBoton);

        componenteCard.append(cardImg);
        componenteCard.append(cardContenido);
        componenteCard.append(cardBoton);

        areaColumna.append(componenteCard);
        $('#cartas').append(areaColumna);

    })

}

function setListenerCartasBoton(cardBoton) {
    cardBoton.on('click', function(){
        alert('En un sprint futuro podrás ver más indormación de: ' + $(this).attr('id'));
    });
}

function pintarItemsSidebar() {

    $.each(categorias.data, function (index, categoria) {
        // Creamos elemento del menú
        let item = $('<div/>', {
            "class": "c-sidebar__item",
            "id": "cat-" + categoria.id,
            "text": categoria.nombre
        });
        // Lo añadimos
        $("#c-sidebar").append(item);
    })

    setListenersItemsSidebar();
}

function setListenersItemsSidebar() {
    // Listener en el menú que afectará a todos los items (habidos y nuevos)
    $("#c-sidebar").on("click", ".c-sidebar__item", function () {
        alert("En el siguiente sprint verás la categoría " + $(this)[0].id);
    })
}

function getImgCarrusel() {

    var carrouselfather = $(".carousel-inner");
    var numsliders = $(".carousel-indicators");
    var contador = 1;



    $.each(imagenesCarrusel.data, function (index, elementoCarrusel) {

        if (index == 0) {
            numsliders.append("<li data-target=\"#carouselExampleCaptions\" data-slide-to=\"0\" class=\"active\"></li>");
            carrouselfather.append("<div class=\"carousel-item active\">" +
                "<img src='assets/img/" + elementoCarrusel.imagen + "' class=\"d-block w-100\">" +
                "<div class=\"carousel-caption d-none d-md-block\">" + "<h5>" + elementoCarrusel.titulo + "</h5>" + "<p>" + elementoCarrusel.descripcion + "</p>" + " </div>" + "</div>"
            );

        } else {
            numsliders.append("<li data-target=\"#carouselExampleCaptions\" data-slide-to=\"" + contador + "\"></li>");
            carrouselfather.append("<div class=\"carousel-item\">" +
                "<img src='assets/img/" + elementoCarrusel.imagen + "' class=\"d-block w-100\">" +
                "<div class=\"carousel-caption d-none d-md-block\">" + " <h5>" + elementoCarrusel.titulo + "</h5> " + "<p>" + elementoCarrusel.descripcion + "</p>" + " </div>" + "</div>"
            );
            contador = contador + 1;
        }
    })

}
