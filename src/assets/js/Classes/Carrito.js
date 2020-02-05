export class Carrito {

    /**
     * Método estático que recibe un JSON y pasa sus propiedades a un objeto.
     * Se usará para transformar el objeto de localStorage a un objeto Carrito (sin perder sus métodos)
     */
    static fromJson(myJson) {
        let myObject = new Carrito();

        Object.assign(myObject, myJson);

        return myObject;
    }

    /**
     * Constructor del carrito: Añade la ID del usuario propietario y un array de servicios
     */
    constructor(userID, servicios) {
        this.userID = userID;

        if (servicios == null) {
            this.servicios = [];
        } else {
            this.servicios = servicios;
        }
    }

    /**
     * Añade un servicio al array de servicios del carrito
     */
    addServicio(servicio) {
        console.log("ADD SERVICIO. THIS ", this);
        console.log("addservicio:", servicio);
        // Obtenemos el servicio del carrito, en caso de que ya estuviera presente
        let servicioPresente = this.servicios.find(s => parseInt(s.id) == parseInt(servicio.id));

        if (servicioPresente == null) {
            // No estaba, así que añadimos el nuevo servicio:
            servicio.unidades = 1;
            this.servicios.push(servicio);
            console.log("No estaba, ahora servicios es", this.servicios);
        } else {
            // Sí estaba, así que le aumentamos las unidades al anterior
            servicioPresente.unidades++;
            console.log("Si estaba, ahora servicios es", this.servicios);
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
            console.log('Estas son las unidades'+s.unidades);
            cantidad += s.unidades;
        })

        console.log('Esta es la cantidad '+cantidad);

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

    /**
     * Quita todos los servicios del carrito, pero mantiene el usuario
     */
    limpiarServicios() {
        this.servicios = [];
        console.log("Carrito - Servicios limpiados!", this);
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
} // fin clase