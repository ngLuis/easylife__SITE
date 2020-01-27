export class Servicio {
    id;
    nombre;
    idCategoria;
    precio;
    imagen;
    descripcion;

    constructor(id, nombre, idCategoria, precio, imagen, descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.idCategoria = idCategoria;
        this.precio = precio;
        this.imagen = imagen;
        this.descripcion = descripcion;
        this.unidades = 1;
    }
}