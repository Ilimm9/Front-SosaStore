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
import { AuthGuard } from './Servicios/auth.guard';
import { RoleGuard } from './Servicios/role.guard';
import { HomeCajeroComponent } from './cajero/home-cajero/home-cajero.component';
import { VentaComponent } from './cajero/venta/venta.component';
import { HistorialComponent } from './cajero/historial/historial.component';
import { ReportesComponent } from './administrador/reportes/reportes.component';


export const routes: Routes = [
    {path:'',component:LoginComponent},
    {path:'login',component:LoginComponent},
    {path: 'gestor', component: GestorComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [1,2,3] }, children: [
        {path:'administrador',component:AdministradorComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [3] }, children: [
            {path:'', redirectTo: 'home', pathMatch: 'full' },
            {path: 'home', component: HomeAdminComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [3] }},
            {path: 'tabla-usuario', component: TablaUsuarioComponent,  canActivate: [AuthGuard, RoleGuard], data: { roles: [3] }},
            {path: 'formulario-usuario', component: FormularioUsuarioComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [3] }},
            {path: 'perfil', component: PerfilComponent,  canActivate: [AuthGuard, RoleGuard], data: { roles: [3] }},
            {path: 'reportes', component: ReportesComponent,  canActivate: [AuthGuard, RoleGuard], data: { roles: [3] }},
        ]},
        {path:'inventario',component:InventarioComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [2] },children:[
            {path:'',redirectTo: 'homeInventario', pathMatch: 'full'},
            {path:'homeInventario',component:HomeInventarioComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [2] }},
            {path:'tablaProducto',component:TablaProductoComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [2] }},
            {path:'agregarProducto',component:AgregarProductoComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [2] }},
            {path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [2] }},
            {path: 'tablaCategoria',component:TablaCategoriaComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [2] }},
            {path: 'formularioCategoria',component:FormularioCategoriaComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [2] }}
        ]},
        {path:'cajero',component:CajeroComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [1] },children:[
            {path:'',redirectTo: 'homeCajero', pathMatch: 'full'},
            {path:'homeCajero',component:HomeCajeroComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [1] }},
            {path:'historialCajero',component: HistorialComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [1] }},
            {path:'ventaCajero',component:VentaComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: [1] }},
        ]}
    ]},

];
