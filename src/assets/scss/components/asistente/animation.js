

function informacion() {

    setTimeout(function () {
        $(".c-asistente").addClass("c-asistente--mostrar");
    }, 15000);



}

function volver() {
    $(".c-asistente__cerrar").on("click", function () {
        $(".c-asistente").removeClass("c-asistente--mostrar");

        /*         setTimeout(informacion
                    , 150000); */
    })
}

export { informacion, volver }