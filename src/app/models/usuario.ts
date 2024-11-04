import { Rol } from "./rol"

export class Usuario {
  idUsuario: number
  nombre: string
  primerApellido: string
  segundoApellido: string
  telefono: string
  correo: string
  activo: number
  nombreUsuario: string
  password: string
  rol: Rol
}
