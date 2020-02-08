export class Servicio {
    id;
    nombre;
    idCategoria;
    precio;
    imagen;
    descripcion;

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