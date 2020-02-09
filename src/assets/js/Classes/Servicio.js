export class Servicio {
    id;
    nombre;
    idCategoria;
    precio;
    imagen;
    descripcion;

    /**
     * Constructor de un servicio. Si no nos pasan unidades en el constructor, pondremos 1.
     */
    constructor(id, nombre, idCategoria, precio, imagen, descripcion, unidades) {
        this.id = id;
        this.nombre = nombre;
        this.idCategoria = idCategoria;
        this.precio = precio;
        this.imagen = imagen;
        this.descripcion = descripcion;
        if (unidades == null) {
            this.unidades = 1;
        } else {
            this.unidades = unidades;
        }
    }
}