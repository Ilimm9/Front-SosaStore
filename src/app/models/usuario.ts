import { Rol } from "./rol"

export class Usuario {
    idUsuario: number
    nombre: string
    primerApellido: string
    segundoApellido: string
    telefono: string
    nombreUsuario: string
    password: string
    rol: Rol

    constructor(
        idUsuario: number,
        nombre: string,
        primerApellido: string,
        segundoApellido: string,
        telefono: string,
        nombreUsuario: string,
        password: string,
        rol: Rol
      ) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.primerApellido = primerApellido;
        this.segundoApellido = segundoApellido;
        this.telefono = telefono;
        this.nombreUsuario = nombreUsuario;
        this.password = password;
        this.rol = rol;
      }

}
