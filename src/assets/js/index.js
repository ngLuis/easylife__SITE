let categorias;

$baseURL = "http://localhost/api/public/api/";

$(function(){
    $.ajax({
        url : $baseURL + 'categoria',
        method : 'GET',
        dataType: 'json'
    })
    .done(function(respuesta){
        categorias = respuesta;

        cargarCartas();
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
        
        setListenerBoton(cardBoton);

        componenteCard.append(cardImg);
        componenteCard.append(cardContenido);
        componenteCard.append(cardBoton);

        areaColumna.append(componenteCard);
        $('#cartas').append(areaColumna);

    })

    function setListenerBoton(cardBoton) {
        cardBoton.on('click', function(){
            alert('En un sprint futuro podrás ver más indormación de: ' + $(this).attr('id'));
        });
    }
}