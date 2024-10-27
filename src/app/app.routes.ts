import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { InventarioComponent } from './inventario/inventario.component';
import { CajeroComponent } from './cajero/cajero.component';

export const routes: Routes = [
    {path:'',component:LoginComponent},
    {path:'login',component:LoginComponent},
    {path:'administrador',component:AdministradorComponent},
    {path:'inventario',component:InventarioComponent},
    {path:'cajero',component:CajeroComponent},


];
