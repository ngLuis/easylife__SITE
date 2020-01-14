export class Carrito {

    servicios = [];

    constructor() {
    }

    addServicio(servicio) {
        this.servicios.push(servicio);
        console.log(this.servicios);
    }

    getServicios() {
        return this.servicios;
    }

    calcularPrecioTotal() {
        let precio = 0;
        $.each(this.servicios, function(index, value) {
            precio += parseInt(value.precio);
        })
        return precio;
    }
}