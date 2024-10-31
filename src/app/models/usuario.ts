import { Rol } from "./rol"

export class Usuario {
  idUsuario: number
  nombre: string
  primerApellido: string
  segundoApellido: string
  telefono: string
  correo: string
  activo: boolean
  nombreUsuario: string
  password: string
  rol: Rol
}
