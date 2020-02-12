

function informacion() {

    setTimeout(function () {
        $(".c-asistente").addClass("c-asistente--mostrar c-asistente--mostrar@movil");
    }, 15000);



}

function volver() {
    $(".c-asistente__cerrar").on("click", function () {
        $(".c-asistente").removeClass("c-asistente--mostrar c-asistente--mostrar@movil");


    })
}

export { informacion, volver }