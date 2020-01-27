export class Carrito {

    /**
     * Constructor del carrito: Añade la ID del usuario propietario y un array de servicios vacío
     */
    constructor() {
        this.userID = null;
        this.servicios = [];
    }

    setUserID(userID) {
        this.userID = userID;
        console.log('Actualizado el usuario del carrito', this);
    }

    /**
     * Añade un servicio al array de servicios del carrito
     */
    addServicio(servicio) {
        // Obtenemos el servicio del carrito, en caso de que ya estuviera presente
        let servicioPresente = this.servicios.find(s => s.id == servicio.id);

        if (servicioPresente == null) {
            // No estaba, así que añadimos el nuevo servicio:
            this.servicios.push(servicio);
        } else {
            // Sí estaba, así que le aumentamos las unidades al anterior
            servicioPresente.unidades++;
        }
    }

    /**
     * Borra un servicio (entero) del array de servicios del carrito
     */
    borrarServicio(idServicio) {
        let indexServicio = this.servicios.findIndex(s => s.id == idServicio);

        if (indexServicio != -1) {
            // El servicio estaba, así que lo borramos (i.e., todas las unidades de dicho servicio)
            this.servicios.splice(indexServicio, 1)
        } else {
            console.log("Situación inesperada: se ha intentado borrar un servicio que ya no estaba en el carrito");
        }
    }

    /**
     * Disminuye la cantidad de un servicio en el array de servicios del carrito
     */
    restarServicio(idServicio) {
        let indexServicio = this.servicios.findIndex(s => s.id == idServicio);

        if (indexServicio != -1) {
            if (this.servicios[indexServicio].unidades >= 1) {
                this.servicios[indexServicio].unidades--;
            }
        } else {
            console.log("Situación inesperada: se ha intentado restar a un servicio que ya no estaba en el carrito");
        }
    }

    /**
     * Aumenta la cantidad de un servicio en el array de servicios del carrito
     */
    sumarServicio(idServicio) {
        let indexServicio = this.servicios.findIndex(s => s.id == idServicio);

        if (indexServicio != -1) {
            if (this.servicios[indexServicio].unidades < 50) {
                this.servicios[indexServicio].unidades++;
            }
        } else {
            console.log("Situación inesperada: se ha intentado sumar a un servicio que no estaba en el carrito");
        }
    }

    /**
     * Devuelve el array de servicios del carrito
     */
    getServicios() {
        return this.servicios;
    }

    /**
     * Devuelve la cantidad de servicios del carrito
     */
    getCantidadServicios() {
        let cantidad = 0;

        $.each(this.servicios, (index, s) => {
            cantidad += s.unidades;
        })

        return cantidad;
    }

    /**
     * Devuelve el precio total de los servicios del carrito
     */
    calcularPrecioTotal() {
        let precio = 0;
        $.each(this.servicios, function (index, servicio) {
            precio += parseInt(servicio.precio * servicio.unidades);
        })
        return precio;
    }

    /*
    //REVIEW pendiente: valorar si compensa guardar en localStorage
        actualizarDatosCarrito() {
            // Actualizamos el carrito
            console.log("Vamos a guardar este carrito", this);
            localStorage.setItem('carrito', JSON.stringify(this));
    
            console.log("Carrito actualizado: ", localStorage.getItem('carrito'));
        }
    */
}