import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { InventarioComponent } from './inventario/inventario.component';
import { CajeroComponent } from './cajero/cajero.component';
import { GestorComponent } from './gestor/gestor.component';
import { TablaUsuarioComponent } from './administrador/tabla-usuario/tabla-usuario.component';
import { FormularioUsuarioComponent } from './administrador/formulario-usuario/formulario-usuario.component';
import { HomeAdminComponent } from './administrador/home-admin/home-admin.component';
import { PerfilComponent } from './perfil/perfil.component';
import { HomeInventarioComponent } from './inventario/home-inventario/home-inventario.component';
import { TablaProductoComponent } from './inventario/tabla-producto/tabla-producto.component';
import { AgregarProductoComponent } from './inventario/agregar-producto/agregar-producto.component';
import { TablaCategoriaComponent } from './inventario/tabla-categoria/tabla-categoria.component';
import { FormularioCategoriaComponent } from './inventario/formulario-categoria/formulario-categoria.component';

export const routes: Routes = [
    {path:'',component:LoginComponent},
    {path:'login',component:LoginComponent},
    {path: 'gestor', component: GestorComponent, children: [
        {path:'administrador',component:AdministradorComponent, children: [
            {path:'', redirectTo: 'home', pathMatch: 'full' },
            {path: 'home', component: HomeAdminComponent},
            {path: 'tabla-usuario', component: TablaUsuarioComponent},
            {path: 'formulario-usuario', component: FormularioUsuarioComponent},
            {path: 'perfil', component: PerfilComponent}
        ]},
        {path:'inventario',component:InventarioComponent,children:[
            {path:'',redirectTo: 'homeInventario', pathMatch: 'full'},
            {path:'homeInventario',component:HomeInventarioComponent},
            {path:'tablaProducto',component:TablaProductoComponent},
            {path:'agregarProducto',component:AgregarProductoComponent},
            {path: 'perfil', component: PerfilComponent},
            {path: 'tablaCategoria',component:TablaCategoriaComponent},
            {path: 'formularioCategoria',component:FormularioCategoriaComponent}
        ]},
        {path:'cajero',component:CajeroComponent}
    ]},

];
