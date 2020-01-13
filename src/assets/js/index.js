import { informacion, volver } from '../scss/components/asistente/animation.js';
import { menu } from '../scss/components/menu/c-menu.js';
import { setListenersModal } from '../scss/components/modal/c-modal.js';

let categorias;
let imagenesCarrusel;
let sesionData;
let miToken;
const $baseURL = "http://localhost/api/public/api/";
/* const miToken */
let content = $(".l-page__right");
let carrousel = $(".c-section__content");


let btnLogin = $("#iniciosesion");
let btnRegister = $("#register");
let startLogin = $("#startLogin");
let modalForm = $("#modalLoginForm");
let dataLogin;

$(function () {
    btnLogin.on("click", function () {
        startLogin.on("click", function () {
            let emailData = $("#defaultForm-email")[0].value;
            let passwordData = $("#defaultForm-pass")[0].value;
            $.ajax({
                url: $baseURL + 'auth/login',
                type: 'POST',
                dataType: 'json',
                data: {
                    email: emailData,
                    password: passwordData
                }
            }).done(function (respuestaSesion) {
                miToken = respuestaSesion['access_token'];
                localStorage.setItem("access_token", miToken);
                let name = respuestaSesion['user']['name'];
                let image = respuestaSesion['user']['image'];
                let modalForm = $("#modalLoginForm");
                modalForm.modal("hide");
                pintarMenuUser(name, image);

            }).fail(function () {
                console.log("algo ha fallado")
            })

        })
    })
})

let peticionCategorias = $.ajax({
    url: $baseURL + 'categoria',
    method: 'GET',
    dataType: 'json'
});

let peticionCarrusel = $.ajax({
    url: $baseURL + 'carrusel',
    type: "GET",
    dataType: "json"
});

$(function () {
    $.when(peticionCategorias, peticionCarrusel)
        .done(function (respuestaCategoria, respuestaCarrusel) {
            categorias = respuestaCategoria[0];
            imagenesCarrusel = respuestaCarrusel[0];

            let categoriasReady = false;
            let imagesReady = false;

            if (categorias.status >= 200 && categorias.status <= 299) {
                // cargarCartas();
                // cargarPaginaInicio();
                categoriasReady = true;
                pintarItemsSidebar();
            } else {
                mostrarErrorDatos(categorias);
            }

            if (imagenesCarrusel.status >= 200 && imagenesCarrusel.status <= 299) {
                imagesReady = true;
                // getImgCarrusel();
            } else {
                mostrarErrorDatos(imagenesCarrusel);
            }

            if (imagesReady && categoriasReady) {
                cargarPaginaInicio();
            }

            setListenersMenu();
            setListenersModal();
            setListenersModalElements();
        })
        .fail(function (xhr) {
            console.log("ERROR del servidor: " + xhr.status + "(" + xhr.statusText + ")");
            console.log("Más información: ", xhr);
        });
})


function cargarPaginaInicio() {
    $('#contenido').empty();
    let lColumns = $('<div/>').addClass('l-columns').attr('id', 'l-columns-contenido');
    $('#contenido').append(lColumns);
    cargarCarousel();
    cargarCartasSection();
    cargarAsistente();
    informacion();
    volver();
}

function cargarCarousel() {
    let lColumns = $('#l-columns-contenido');
    let lColumnsArea = $('<div/>').addClass('l-columns__area');
    let section = $('<div/>').addClass('c-section c-section--light c-section--padding-vertical-xl c-section--padding-horizontal-xs');
    let sectionContent = $('<div/>').addClass('c-section__content');
    let carouselContainer = $('<div/>').addClass('carousel slide').attr({
        id: 'carouselExampleCaptions',
        'data-ride': 'carousel'
    });
    let ol = $('<ol/>').addClass('carousel-indicators');
    let carouselInner = $('<div/>').addClass('carousel-inner');
    let aPrev = $('<a/>').addClass('carousel-control-prev').attr({
        href: '#carouselExampleCaptions',
        role: 'button',
        'data-slide': 'prev'
    });
    let spanPrevIcon = $('<span/>').addClass('carousel-control-prev-icon').attr('aria-hidden', 'true');
    let spanPrevOnly = $('<span/>').addClass('sr-only').text('Previous');
    let aNext = $('<a/>').addClass('carousel-control-next').attr({
        href: '#carouselExampleCaptions',
        role: 'button',
        'data-slide': 'next'
    });
    let spanNextIcon = $('<span/>').addClass('carousel-control-next-icon').attr('aria-hidden', 'true');
    let spanNextOnly = $('<span/>').addClass('sr-only').text('Next');

    aPrev.append(spanPrevOnly);
    aPrev.append(spanPrevIcon);
    aNext.append(spanNextIcon);
    aNext.append(spanNextOnly);
    carouselContainer.append(aNext);
    carouselContainer.append(aPrev);
    carouselContainer.append(carouselInner);
    carouselContainer.append(ol);
    sectionContent.append(carouselContainer);
    section.append(sectionContent);
    lColumnsArea.append(section);
    lColumns.append(lColumnsArea)

    getImgCarrusel();
}

function cargarCartasSection() {
    let lColumns = $('#l-columns-contenido');
    let lColumnsArea = $('<div/>').addClass('l-columns__area');
    let section = $('<div/>').addClass('c-section c-section--light c-section--padding-vertical-xxl c-section--padding-horizontal-m');
    let sectionTitle = $('<h1/>').addClass('c-section__title').text('Categorías');
    let sectionContent = $('<div/>').addClass('c-section__content');
    let lColumnsCartas = $('<div/>').addClass('l-columns l-columns--3-columns').attr('id', 'cartas');

    section.append(sectionTitle);
    sectionContent.append(lColumnsCartas);
    section.append(sectionContent);
    lColumnsArea.append(section);
    lColumns.append(lColumnsArea);

    cargarCartas();

}

function pintarMenuUser(name, image) {
    /*    let btnRegister = $("#register"); */
    let modalAvatar = $("<a>"); // Contendrá el div que añadiremos al menu para la foto
    let divImgAvatar = $("<img>");
    modalAvatar.addClass("c-menu__option c-menu__option--avatar"); // Esta clase configurará el tamaño
    modalAvatar.attr("id", "miavatar")
    modalAvatar.append(divImgAvatar);
    divImgAvatar.attr("src", "assets/img/" + image);
    divImgAvatar.addClass("c-menu__option--avatar");
    let menu = $(".c-menu");
    menu.append(modalAvatar);
    btnLogin.html(name);
    btnLogin.removeAttr("data-toggle");
    btnLogin.removeAttr("data-target")
    btnRegister.html("Cerrar sesion");
    btnRegister.attr("id", "logout")
    logoutSesion();



}

function logoutSesion() {
    let btnLogout = $("#logout");
    let miTokenStorage = localStorage.getItem("access_token");

    btnLogout.on("click", function () {
        $.ajax({
            url: $baseURL + 'auth/logout?token=' + miTokenStorage,
            type: 'POST',
            dataType: 'json',
        }).done(function (respuestaLogout) {
            console.log(respuestaLogout);
            alert("Sesión cerrada correctamente");
            localStorage.clear();
            var url = "http://localhost/site";
            $(location).attr('href', url);
            // cargarPaginaInicio();
        }).fail(function () {
            console.log("Algo ha fallado");
        })
    });




}

function cargarCartas() {

    $.each(categorias.data, function (index, element) {

        let areaColumna = $('<div>').addClass('l-columns__area');

        let componenteCard = $('<div>').addClass('c-card');

        let cardImg = $('<img>').attr('src', './assets/img/cartas/' + element.imagen).addClass('c-card__img');

        let cardContenido = $('<div>').addClass('c-card__content');
        let cardTitulo = $('<h2>').addClass('c-card__title').append(element.nombre);
        let cardDescripcion = $('<h2>').addClass('c-card__text').append(element.descripcion);
        cardContenido.append(cardTitulo);
        cardContenido.append(cardDescripcion);

        let cardBoton = $('<div>').addClass('c-card__button').attr('id', 'cat-' + element.id);
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

function cargarAsistente() {
    let lColumns = $('#l-columns-contenido');
    let lColumnsArea = $('<div/>').addClass('l-columns__area');
    let section = $('<div/>').addClass('c-section');
    let sectionContent = $('<div/>').addClass('c-section__content');
    let asistente = $('<div/>').addClass('c-asistente').attr('style', "background-image: url('./assets/img/fondo-asistente.jpg')");
    let asistenteCabecera = $('<h2/>').addClass('c-asistente__cabecera').text('¿Necesitas ayuda?');
    let cabeceraIcon = $('<i/>').addClass('far fa-comment-alt');
    let asistenteTexto = $('<p/>').addClass('c-asistente__texto').text('Llámanos al 636 876 856 y te atenderemos personalmente.');
    let asistenteImagen = $('<img/>').addClass('c-asitente__imagen').attr('src', './assets/img/asistente.jpg');
    let asistenteCerrar = $('<a/>').addClass('c-asistente__cerrar');
    let cerrarIcon = $('<i/>').addClass('far fa-window-close');

    asistenteCabecera.append(cabeceraIcon);
    asistente.append(asistenteCabecera);
    asistente.append(asistenteTexto);
    asistente.append(asistenteImagen);
    asistenteCerrar.append(cerrarIcon);
    asistente.append(asistenteCerrar);
    sectionContent.append(asistente);
    section.append(sectionContent);
    lColumnsArea.append(section);
    lColumns.append(lColumnsArea);
}

function setListenerCartasBoton(cardBoton) {
    cardBoton.on('click', function () {
        alert('En un sprint futuro podrás ver más información de: ' + $(this).attr('id'));
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
        $('.c-menu__option--selected').removeClass('c-menu__option--selected');
        let idCategoria = this.id.split('-');
        mostrarServicios(idCategoria[1]);
    })
}

function mostrarServicios(idCategoria) {

    $('#contenido').empty();
    $.ajax({
        url: $baseURL + 'categoria/' + idCategoria + '/servicio/',
        dataType: 'json',
        type: 'GET',
    }).done((response) => {
        let lColumns = $('<div/>').addClass('l-columns');
        let lColumnsArea = $('<div/>').addClass('l-columns__area');
        let section = $('<div/>').addClass('c-section c-section--light c-section--padding-vertical-xxl c-section--padding-horizontal-s');
        let sectionContent = $('<div/>').addClass('c-section__content');
        let lColumnsInsideSection = $('<div/>').addClass('l-columns l-columns--4-columns').attr('id', 'contenedor-articulos');
        $.each(response.data, function (index, value) {
            let lColumnsInsideSectionArea = $('<div/>').addClass('l-columns__area');
            let articulo = $('<div/>').addClass('c-articulo');
            let articuloImg = $('<img/>').addClass('c-articulo__image').attr('src', './assets/img/img1.jpg');
            let articuloTitulo = $('<h3/>').addClass('c-articulo__title').text(value.nombre);
            let articuloPrecio = $('<h6/>').addClass('c-articulo__price').text(value.precio + '€');
            let articuloBoton = $('<a/>').addClass('c-articulo__button').text('Ver en detalle');

            articulo.append(articuloImg);
            articulo.append(articuloTitulo);
            articulo.append(articuloPrecio);
            articulo.append(articuloBoton);
            lColumnsInsideSectionArea.append(articulo);
            lColumnsInsideSection.append(lColumnsInsideSectionArea);
        });

        sectionContent.append(lColumnsInsideSection);
        section.append(sectionContent);
        lColumnsArea.append(section);
        lColumns.append(lColumnsArea)
        $('#contenido').append(lColumns);
        addListenersServicios();
    }).fail((response) => {
        $('#contenido').text('No se han encontrado servicios en esta categoría');
    });
}

function addListenersServicios() {
    $(".c-articulo").on("click", ".c-articulo__button", function () {
        alert('Mostrar modal con la información');
    });
}

function mostrarErrorDatos(json) {
    console.log("ERROR al obtener los datos: " + json.status + "(" + json.code + "). Revisar si hay datos en la BBDD");
    console.log("Más información: ", json);
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

function setListenersMenu() {
    console.log('Entra en listeners menu');
    menu();
    setListenersButtonsMenu();
}

function setListenersButtonsMenu() {
    $('.c-menu').on('click', '.c-menu__option', function () {
        console.log('El click funciona');
        let id = $(this).attr('id');
        console.log('Esta es la id: '+id);
        if (id === 'menu-inicio') {
            cargarPaginaInicio();
        } else if ( id === 'register' ) {
            console.log('Entra dentro de menu-registro');
            if ($('#register').text() === 'Regístrate'){
                showModal('registro');
            } else {
                cambiarValoresMenu();
            }
        }
    })
}
function showModal( modalName ) {
    $('#'+modalName).addClass('c-modal--show');
}

function setListenersModalElements() {
    $('#boton-registrar').on('click', registrarUsuario);
}

function registrarUsuario() {
    const user = {
        "name": $('#name-registro').val(),
        "email": $('#email-registro').val(),
        "password": $('#password-registro').val(),
        "dni": $('#dni-registro').val(),
        "type": "1",
    }

    $.ajax({
        url: $baseURL+'auth/register',
        type: 'POST',
        dataType: 'json',
        data: user
    })
    .done((response) => {
        console.log(response);
        localStorage.setItem('access_token', response.access_token);
        $(this).parent().parent().parent().removeClass('c-modal--show');
        let image = 'asdsad';
        pintarMenuUser(user.name, image);
    })
    .fail((response) => {
        console.log(response);
        if ( response.responseJSON.code === 403 ) {
            alert('Alguno de los datos no están bien introducidos');
        }
    });
}

function cambiarValoresMenu() {
    if ( $('#register').text() === 'Regístrate' && $('#menu-inicio-sesion').text() === 'Inicia Sesión' ) {
        $('#menu-inicio-sesion').text('Nombre de usuario');
        $('#register').text('Cerrar Sesión');
    } else {
        $('#menu-inicio-sesion').text('Inicia Sesión');
        $('#register').text('Regístrate');
    }
}
