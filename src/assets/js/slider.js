
function getImg() {


    $.ajax({
        //url: "http://172.16.205.3/api/public/api/imagenesCarrusel",
        url: "http://localhost/src/public/api/imagenesCarrusel",
        type: "GET",
        dataType: "json",
        success: function (respuesta) {
            var carrouselfather = $(".carousel-inner");
            var numsliders = $(".carousel-indicators");
            var contador = 1;

            /*  var respuesta2 = JSON.parse(respuesta);
             console.log(respuesta2);
             console.log(respuesta2.data); */
            $.each(respuesta[0].data, function (index, e) {
                // console.log(respuesta);
                if (index == 0) {
                    numsliders.append("<li data-target=\"#carouselExampleCaptions\" data-slide-to=\"0\" class=\"active\"></li>");
                    carrouselfather.append("<div class=\"carousel-item active\">" +
                        "<img src='assets/img/" + e.imagen + "' class=\"d-block w-100\">" +
                        "<div class=\"carousel-caption d-none d-md-block\">" + "<h5>" + e.titulo + "</h5>" + "<p>" + e.descripcion + "</p>" + " </div>" + "</div>"
                    );

                } else {
                    numsliders.append("<li data-target=\"#carouselExampleCaptions\" data-slide-to=\"" + contador + "\"></li>");
                    carrouselfather.append("<div class=\"carousel-item\">" +
                        "<img src='assets/img/" + e.imagen + "' class=\"d-block w-100\">" +
                        "<div class=\"carousel-caption d-none d-md-block\">" + " <h5>" + e.titulo + "</h5> " + "<p>" + e.descripcion + "</p>" + " </div>" + "</div>"
                    );
                    contador = contador + 1;
                }
            })
        },
        error: function (error) {
            console.log(error);
            console.log("No hay información: " + error.status);

        }
    });


}

