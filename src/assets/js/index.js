import { informacion, volver } from '../scss/components/asistente/animation.js';
import { menu } from '../scss/components/menu/c-menu.js';
import { setListenersModal } from '../scss/components/modal/c-modal.js';
import { guardarCarritoEnLocal, getLocalShoppingCart, updateShoppingCartIcon, pintarCarrito, setListenersShoppingCart, obtenerCarritosUsuario } from '../scss/components/cart/c-cart.js';
import { Carrito } from './Classes/Carrito.js';
import { Servicio } from './Classes/Servicio.js';
import { FormValidator } from './Classes/FormValidator.js';

let categorias;
let imagenesCarrusel;
let allServicios;
let sesionData;
let miToken;
let serviciosActuales;
let carrito// = new Carrito();
let formValidator = new FormValidator();
let servicioSeleccionado;
const BASEURL = "http://localhost/api/public/api/";
/* const miToken */
let content = $(".l-page__right");
let carrousel = $(".c-section__content");

let btnLogin = $("#iniciosesion");
let btnRegister = $("#register");
let startLogin = $("#startLogin");
let modalForm = $("#modalLoginForm");
let dataLogin;

let peticionCategorias = $.ajax({
    url: BASEURL + 'categoria',
    method: 'GET',
    dataType: 'json'
});

let peticionCarrusel = $.ajax({
    url: BASEURL + 'carousel',
    type: "GET",
    dataType: "json"
});

let peticionServicios = $.ajax({
    url: BASEURL + 'servicio',
    method: 'GET',
    dataType: 'json'
});

/**
 * ML yo creo que esto tendría que ir en un setListenersLogin y llamado como el resto
 * Así solo hay una función de carga en el inicio.
 */
$(function () {
    startLogin.on("click", function () {
        let emailData = $("#defaultForm-email")[0].value;
        let passwordData = $("#defaultForm-pass")[0].value;
        $.ajax({
            url: BASEURL + 'auth/login',
            type: 'POST',
            dataType: 'json',
            data: {
                email: emailData,
                password: passwordData
            }
        }).done(function (respuestaSesion) {
            console.log("Login - OK, logueado", respuestaSesion);

            miToken = respuestaSesion['access_token'];
            localStorage.setItem("access_token", miToken);
            let name = respuestaSesion['user']['name'];
            let image = respuestaSesion['user']['image'];
            let modalForm = $("#modalLoginForm");
            modalForm.modal("hide");
            pintarMenuUser(name, image);

            guardarDatosUsuario(respuestaSesion);
            obtenerCarritosUsuario();

        }).fail(function (error) {
            alert("¡Error! Por favor, revisa tus credenciales.");
            console.log("Login - se ha producido un error", error);
        })
    })
})


$(function () {
    $.when(peticionCategorias, peticionCarrusel, peticionServicios)
        .done(function (respuestaCategoria, respuestaCarrusel, respuestaServicios) {
            categorias = respuestaCategoria[0];
            imagenesCarrusel = respuestaCarrusel[0];
            allServicios = respuestaServicios[0].data;
            console.log("Guardamos estos servicios para usar desde otras clases:", allServicios);

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

            if (localStorage.getItem("access_token") == null) {
                defaultMenu();
            } else {
                refreshMenu();
            }
            setListenersMenu();
            setListenersModal();
            setListenersModalElements();
            setListenersShoppingCart();
            setListenerModalServicio();

        })
        .fail(function (xhr) {
            console.log("ERROR del servidor: " + xhr.status + "(" + xhr.statusText + ")");
            console.log("Más información: ", xhr);
        });
})

function defaultMenu() {
    let iniSesion = $('<i/>').addClass('c-menu__icon fas fa-sign-in-alt');
    $('#iniciosesion').append(iniSesion);
    $('#iniciosesion').append(' Iniciar sesión');
    let regist = $('<i/>').addClass('c-menu__icon fas fa-user-plus');
    $('#register').append(regist);
    $('#register').append(' Regístrate');
}

function cargarPaginaInicio() {
  $("#contenido").empty();
  let lColumns = $("<div/>")
    .addClass("l-columns")
    .attr("id", "l-columns-contenido");
  $("#contenido").append(lColumns);
  cargarCarousel();
  cargarCartasSection();
  cargarAsistente();
  informacion();
  volver();
}

function cargarCarousel() {
    let lColumns = $('#l-columns-contenido');
    let lColumnsArea = $('<div/>').addClass('l-columns__area g--display-none@movil');
    let section = $('<div/>').addClass('c-section c-section--light c-section--padding-vertical-xl c-section--padding-horizontal-xs');
    let sectionContent = $('<div/>').addClass('c-section__content');
    let carouselContainer = $('<div/>').addClass('carousel slide').attr({
        id: 'carouselExampleCaptions',
        'data-ride': 'carousel'
    });
  let ol = $("<ol/>").addClass("carousel-indicators");
  let carouselInner = $("<div/>").addClass("carousel-inner");
  let aPrev = $("<a/>")
    .addClass("carousel-control-prev")
    .attr({
      href: "#carouselExampleCaptions",
      role: "button",
      "data-slide": "prev"
    });
  let spanPrevIcon = $("<span/>")
    .addClass("carousel-control-prev-icon")
    .attr("aria-hidden", "true");
  let spanPrevOnly = $("<span/>")
    .addClass("sr-only")
    .text("Previous");
  let aNext = $("<a/>")
    .addClass("carousel-control-next")
    .attr({
      href: "#carouselExampleCaptions",
      role: "button",
      "data-slide": "next"
    });
  let spanNextIcon = $("<span/>")
    .addClass("carousel-control-next-icon")
    .attr("aria-hidden", "true");
  let spanNextOnly = $("<span/>")
    .addClass("sr-only")
    .text("Next");

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
  lColumns.append(lColumnsArea);

  getImgCarrusel();

  $(".carousel").carousel({
    "data-pause": false,
    interval: 3000
  });
}

function cargarCartasSection() {
  let lColumns = $("#l-columns-contenido");
  let lColumnsArea = $("<div/>").addClass("l-columns__area");
  let section = $("<div/>").addClass(
    "c-section c-section--light c-section--padding-vertical-xxl c-section--padding-horizontal-m c-section--padding-horizontal-s@movil c-section--padding-vertical-l@movil"
  );
  let sectionTitle = $("<h1/>")
    .addClass("c-section__title")
    .text("Servicios");
  let sectionContent = $("<div/>").addClass("c-section__content");
  let lColumnsCartas = $("<div/>")
    .addClass("l-columns l-columns--3-columns l-columns--1-columns@movil")
    .attr("id", "cartas");

  section.append(sectionTitle);
  sectionContent.append(lColumnsCartas);
  section.append(sectionContent);
  lColumnsArea.append(section);
  lColumns.append(lColumnsArea);

  cargarCartas();
}

function pintarMenuUser(name, image) {
    let modalAvatar = $("<a>"); // queda pendiente añadir modal (sam)
    let divImgAvatar = $("<img>");
    modalAvatar.addClass("c-menu__option c-menu__option--caja-image c-menu__option--padding-none c-menu__option--padding-none@movil c-menu__option--margin-none");
    modalAvatar.attr("id", "miavatar")
    modalAvatar.append(divImgAvatar);
    divImgAvatar.attr(
      "src",
      "http://localhost/api/storage/app/public/avatars/" + image
    );
    divImgAvatar.addClass("c-menu__option c-menu__option--image c-menu__option--margin-right-m@movil /* g--padding-zero g--margin-zero */");
    divImgAvatar.attr("style", "width:65px; height:65px")
    let menu = $(".c-menu");
    menu.append(modalAvatar);
    btnLogin.html(name);
    btnLogin.removeAttr("data-toggle");
    btnLogin.removeAttr("data-target")
    btnRegister.html("Cerrar sesión");
    btnRegister.attr("id", "logout")
    logoutSesion();
}

function refreshMenu() {
    let miTokenStorage = localStorage.getItem("access_token");
    $.ajax({
        url: BASEURL + 'auth/me?token=' + miTokenStorage,
        type: 'POST',
        dataType: 'json',
    }).done(function (response) {
        pintarMenuUser(response.name, response.image);
        obtenerCarritosUsuario();

    }).fail(function (response) {
        console.log("Token - Error de autenticación con el token de localStorage. Posiblemente haya caducado");
        console.log("Token - Más información: ", response);
        if (response.status === 401) {
            alert("¡Tu sesión ha caducado! Por favor, vuelve a iniciar sesión.");
            localStorage.clear();
        }
        // Cargamos el menú de usuarios sin autentificar
        defaultMenu();
    })
}

function logoutSesion() {
    let btnLogout = $("#logout");
    let miTokenStorage = localStorage.getItem("access_token");

    btnLogout.on("click", function () {
        $.ajax({
            url: BASEURL + 'auth/logout?token=' + miTokenStorage,
            type: 'POST',
            dataType: 'json',
        }).done(function (respuestaLogout) {
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
  $.each(categorias.data, function(index, element) {
    let areaColumna = $("<div>").addClass("l-columns__area");

    let componenteCard = $("<div>").addClass("c-card");

    let cardImg = $("<img>")
      .attr(
        "src",
        "http://localhost/api/storage/app/public/categorias/" + element.imagen
      )
      .addClass("c-card__img");

    let cardContenido = $("<div>").addClass("c-card__content");
    let cardTitulo = $("<h2>")
      .addClass("c-card__title")
      .append(element.nombre);
    let cardDescripcion = $("<h2>")
      .addClass("c-card__text")
      .append(element.descripcion);
    cardContenido.append(cardTitulo);
    cardContenido.append(cardDescripcion);

    let cardBoton = $("<div>")
      .addClass("c-card__button")
      .attr("id", "cat-" + element.id);
    let linkBoton = $("<a>")
      .addClass("c-card__link")
      .append("Leer Más");
    cardBoton.append(linkBoton);

    setListenerCartasBoton(cardBoton);

    componenteCard.append(cardImg);
    componenteCard.append(cardContenido);
    componenteCard.append(cardBoton);

    areaColumna.append(componenteCard);
    $("#cartas").append(areaColumna);
  });
}

function cargarAsistente() {
  let lColumns = $("#l-columns-contenido");
  let lColumnsArea = $("<div/>").addClass("l-columns__area");
  let section = $("<div/>").addClass("c-section");
  let sectionContent = $("<div/>").addClass("c-section__content");
  let asistente = $("<div/>")
    .addClass("c-asistente")
    .attr("style", "background-image: url('./assets/img/fondo-asistente.jpg')");
  let asistenteCabecera = $("<h2/>")
    .addClass("c-asistente__cabecera")
    .text("¿Necesitas ayuda?");
  let cabeceraIcon = $("<i/>").addClass("far fa-comment-alt");
  let asistenteTexto = $("<p/>")
    .addClass("c-asistente__texto")
    .text("Llámanos al 636 876 856 y te atenderemos personalmente.");
  let asistenteImagen = $("<img/>")
    .addClass("c-asitente__imagen")
    .attr("src", "./assets/img/asistente.jpg");
  let asistenteCerrar = $("<a/>").addClass("c-asistente__cerrar");
  let cerrarIcon = $("<i/>").addClass("far fa-window-close");

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
  cardBoton.on("click", function() {
    // alert('En un sprint futuro podrás ver más información de: ' + $(this).attr('id'));
    let idCategoria = $(this)
      .attr("id")
      .split("cat-");
    mostrarServicios(idCategoria[1]);
    //REVIEW - FALTA QUE CUANDO CARGUE LOS SERVICIOS VAYA ARRIBA DE LA PAGINA
  });
}

function pintarItemsSidebar() {
  $.each(categorias.data, function(index, categoria) {
    // Creamos elemento del menú
    let item = $("<div/>", {
      class: "c-sidebar__item",
      id: "cat-" + categoria.id,
      text: categoria.nombre
    });
    // Lo añadimos
    $("#c-sidebar").append(item);
  });

  setListenersItemsSidebar();
}

function setListenersItemsSidebar() {
  // Listener en el menú que afectará a todos los items (habidos y nuevos)
  $("#c-sidebar").on("click", ".c-sidebar__item", function() {
    $(".c-menu__option--selected").removeClass("c-menu__option--selected");
    let idCategoria = this.id.split("-");
    mostrarServicios(idCategoria[1]);
  });
}

function obtenerCategoria(id) {
  let nombre;
    $.each(categorias.data, function(index, element) {
        if (element.id == id){
          nombre = element.nombre;
        }
    });
    return nombre;
}

function mostrarServicios(idCategoria) {
    let nombreCategoria = obtenerCategoria(idCategoria);
  $.ajax({
    url: BASEURL + "categoria/" + idCategoria + "/servicio",
    dataType: "json",
    type: "GET"
  })
    .done(response => {
      $("#contenido").empty();
      serviciosActuales = response.data;
      let lColumns = $("<div/>").addClass("l-columns");
      let lColumnsArea = $("<div/>").addClass("l-columns__area");
      let section = $("<div/>").addClass(
        "c-section c-section--light c-section--padding-vertical-xxl c-section--padding-horizontal-s c-section--padding-horizontal-s@movil c-section--padding-vertical-l@movil"
      );
      let sectionTitle = $("<h1/>")
        .addClass("c-section__title")
        .text(nombreCategoria);
      let sectionContent = $("<div/>").addClass("c-section__content");
      let lColumnsInsideSection = $("<div/>")
        .addClass("l-columns l-columns--3-columns l-columns--1-columns@movil")
        .attr("id", "contenedor-articulos");
      $.each(response.data, function(index, value) {
        let lColumnsInsideSectionArea = $("<div/>").addClass("l-columns__area");
        let articulo = $("<div/>").addClass("c-articulo");
        let articuloImg = $("<img/>")
          .addClass("c-articulo__image")
          .attr(
            "src",
            "http://localhost/api/storage/app/public/servicios/" + value.imagen
          );
        let articuloTitulo = $("<h3/>")
          .addClass("c-articulo__title")
          .text(value.nombre);
        let articuloPrecio = $("<h6/>")
          .addClass("c-articulo__price")
          .text(value.precio + "€");
        let articuloBoton = $("<a/>")
          .addClass("c-articulo__button")
          .text("Ver en detalle")
          .attr({
            id: "servicio-" + value.id,
            "data-toggle": "modal",
            "data-target": "#modalServicios"
          });

        articulo.append(articuloImg);
        articulo.append(articuloTitulo);
        articulo.append(articuloPrecio);
        articulo.append(articuloBoton);
        lColumnsInsideSectionArea.append(articulo);
        lColumnsInsideSection.append(lColumnsInsideSectionArea);
      });

      sectionContent.append(lColumnsInsideSection);
      section.append(sectionTitle);
      section.append(sectionContent);
      lColumnsArea.append(section);
      lColumns.append(lColumnsArea);
      $("#contenido").append(lColumns);
      addListenersServicios();
    })
    .fail(response => {
      $("#contenido").text("No se han encontrado servicios en esta categoría");
    });
}

function addListenersServicios() {
  $(".c-articulo").on("click", ".c-articulo__button", function() {
    let idServicio = $(this)
      .attr("id")
      .split("-")[1];
    let servicio = $.grep(serviciosActuales, function(servicio) {
      return servicio.id == idServicio;
    })[0];
    servicioSeleccionado = new Servicio(
      servicio.id,
      servicio.nombre,
      servicio.categoria_id,
      servicio.precio,
      servicio.imagen,
      servicio.descripcion
    );
    cargarModal(servicioSeleccionado);
  });
}

function cargarModal(servicio) {
    $(".modal-body-servicio").empty();
    $(".modal-title").empty();
    $(".modal-title").addClass("c-modal-bootstrap__titulo").append(servicio.nombre);

    let imagen = $("<img>").attr("src", 'http://localhost/api/storage/app/public/servicios/' + servicio.imagen).addClass("c-modal-bootstrap__img");

    let precio = $("<p>").text("Precio: " + servicio.precio + " €").addClass("c-modal-bootstrap__precio");
    let texto = $("<p>").text(servicio.descripcion).addClass("c-modal-bootstrap__texto");

    let modal = $("<div>").addClass("c-modal-bootstrap__content");
    modal.append(imagen);
    modal.append(precio);
    modal.append(texto);
    $(".modal-body-servicio").append(modal);
}

function setListenerModalServicio() {
    $('#anyadir-carrito').on('click', function () {
        $("#modalServicios").modal("hide");
        // Si está logueado, añadimos al carrito. Si no, redirigimos a login
        //TODO Ahora mismo redirige a registro, cuando adapten el modal de Login poner el del login
        if (localStorage.getItem("access_token") != null) {
            let micarrito = getLocalShoppingCart();
            console.log("modalservicio; este esel carrito", micarrito);
            micarrito.addServicio(servicioSeleccionado);
            guardarCarritoEnLocal(micarrito);
            updateShoppingCartIcon(micarrito);
        } else {
            showModal('registro');
        }
    });
}

//TODO mover a JS de carrito


function mostrarErrorDatos(json) {
  console.log(
    "ERROR al obtener los datos: " +
      json.status +
      "(" +
      json.code +
      "). Revisar si hay datos en la BBDD"
  );
  console.log("Más información: ", json);
}

function getImgCarrusel() {
  var carrouselfather = $(".carousel-inner");
  var numsliders = $(".carousel-indicators");
  var contador = 1;

  $.each(imagenesCarrusel.data, function(index, elementoCarrusel) {
    if (index == 0) {
      numsliders.append(
        '<li data-target="#carouselExampleCaptions" data-slide-to="0" class="active"></li>'
      );
      carrouselfather.append(
        '<div class="carousel-item active">' +
          "<img src='http://localhost/api/storage/app/public/carousel/" +
          elementoCarrusel.imagen +
          '\' class="d-block w-100">' +
          '<div class="carousel-caption d-none d-md-block">' +
          "<h5>" +
          elementoCarrusel.titulo +
          "</h5>" +
          "<p>" +
          elementoCarrusel.descripcion +
          "</p>" +
          " </div>" +
          "</div>"
      );
    } else {
      numsliders.append(
        '<li data-target="#carouselExampleCaptions" data-slide-to="' +
          contador +
          '"></li>'
      );
      carrouselfather.append(
        '<div class="carousel-item">' +
          "<img src='http://localhost/api/storage/app/public/carousel/" +
          elementoCarrusel.imagen +
          '\' class="d-block w-100">' +
          '<div class="carousel-caption d-none d-md-block">' +
          " <h5>" +
          elementoCarrusel.titulo +
          "</h5> " +
          "<p>" +
          elementoCarrusel.descripcion +
          "</p>" +
          " </div>" +
          "</div>"
      );
      contador = contador + 1;
    }
  });
}

function setListenersMenu() {
  menu();
  setListenersButtonsMenu();
}

function setListenersButtonsMenu() {
    $('.c-menu').on('click', '.c-menu__option', function () {
        let id = $(this).attr('id');
        if (id === 'menu-inicio') {
            cargarPaginaInicio();
        } else if (id === 'register') {
            if ($('#register').text() === 'Regístrate') {
                showModal('registro');
                $('#formulario-registro').on('keyup', 'input', function () {
                    let inputValue = $(this).val();
                    let inputType = $(this).attr('input-form');

                    formValidator.regularExpressions.INPUT_PASSWORD1 = $('[input-form="INPUT_PASSWORD1"]').val();
                    formValidator.regularExpressions.INPUT_PASSWORD2 = $('[input-form="INPUT_PASSWORD2"]').val();

                    let message = formValidator.validateInput(inputType, inputValue);
                    if (inputType === 'INPUT_PASSWORD1' || inputType === 'INPUT_PASSWORD2') {
                        $('[input-form="INPUT_PASSWORD1"]').prev().text(message);
                        $('[input-form="INPUT_PASSWORD2"]').prev().text(message);
                    } else {
                        $(this).prev().text(message);
                    }


                    $('#boton-registrar').attr('disabled', formValidator.getButtonState());
                });
            } else {
                cambiarValoresMenu();
            }
        } else if (id === 'menu-shopping-cart') {
            pintarCarrito();
            showModal('modal-shopping-cart');
        }
    })
}
function showModal(modalName) {
    $('#' + modalName).addClass('c-modal--show');
}

function hideModal(modalName) {
    $('#' + modalName).removeClass('c-modal--show');
}

function setListenersModalElements() {
  $("#boton-registrar").on("click", registrarUsuario);
}


function registrarUsuario() {
    const userForm = new FormData();
    userForm.append("name", $('[input-form="INPUT_NAME"]').val());
    userForm.append("email", $('[input-form="INPUT_EMAIL"]').val());
    userForm.append("password", $('[input-form="INPUT_PASSWORD1"]').val());
    userForm.append("dni", $('[input-form="INPUT_DNI"]').val());
    userForm.append("type", '0');
    userForm.append("avatar", $('[input-form="INPUT_FILE"]')[0].files[0]);

    // //Abajo añadir processData: false
    $.ajax({
        url: BASEURL + 'auth/register',
        type: 'POST',
        data: userForm,
        processData: false,
        contentType: false,
    })
        .done((response) => {
            console.log(response);
            localStorage.setItem('access_token', response.access_token);
            $(this).parent().parent().parent().parent().removeClass('c-modal--show');
            let image = 'harold.jpg';
            pintarMenuUser($('[input-form="INPUT_NAME"]').val(), response.user.image);
            guardarDatosUsuario(response);
            obtenerCarritosUsuario();//ML
        })
        .fail((response) => {
            console.log(response);
            if (response.responseJSON.code === 403) {
                alert('Alguno de los datos no están bien introducidos');
            }
        });
}

function cambiarValoresMenu() {
    if ($('#register').text() === 'Regístrate' && $('#menu-inicio-sesion').text() === 'Inicia Sesión') {
        $('#menu-inicio-sesion').text('Nombre de usuario');
        $('#register').text('Cerrar Sesión');
    } else {
        $('#menu-inicio-sesion').text('Inicia Sesión');
        $('#register').text('Regístrate');
    }
}

/**
 * Guarda los datos del usuario recibidos por el servidor en el localStorage, para acceder fácilmente a ellos.
 * Se obtiene a través del access_token que devuelve el servidor.
 */
function guardarDatosUsuario(tokenResponse) {
    // Guardamos datos del usuario en el localStorage y su ID en el carrito
    localStorage.setItem('datosUsuario', JSON.stringify(tokenResponse.user));
    console.log("Guardado datos de usuario en localStorage: ", localStorage.getItem('datosUsuario'));
}

// Exportar variables
export { allServicios, BASEURL, hideModal };