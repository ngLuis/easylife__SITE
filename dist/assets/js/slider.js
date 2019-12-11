
function getImg() {


    $.ajax({
        url: "http://localhost/api/public/api/carrusel",
        type: "GET",
        dataType: "json",
        success: function (respuesta) {
            var carrouselfather = $(".carousel-inner");
            var numsliders = $(".carousel-indicators");
            var contador = 1;

            $.each(respuesta.data, function (index, e) {
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

