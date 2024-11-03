import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { InventarioComponent } from './inventario/inventario.component';
import { CajeroComponent } from './cajero/cajero.component';
import { GestorComponent } from './gestor/gestor.component';
import { TablaUsuarioComponent } from './administrador/tabla-usuario/tabla-usuario.component';
import { FormularioUsuarioComponent } from './administrador/formulario-usuario/formulario-usuario.component';
import { HomeAdminComponent } from './administrador/home-admin/home-admin.component';

export const routes: Routes = [
    {path:'',component:LoginComponent},
    {path:'login',component:LoginComponent},
    {path: 'gestor', component: GestorComponent, children: [
        {path:'administrador',component:AdministradorComponent, children: [
            {path:'', redirectTo: 'home', pathMatch: 'full' },
            {path: 'home', component: HomeAdminComponent},
            {path: 'tabla-usuario', component: TablaUsuarioComponent},
            {path: 'formulario-usuario', component: FormularioUsuarioComponent}
        ]},
        {path:'inventario',component:InventarioComponent},
        {path:'cajero',component:CajeroComponent}
    ]},

];
