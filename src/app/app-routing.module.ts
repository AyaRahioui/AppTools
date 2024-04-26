import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserComponent } from './user/user.component';
import { PlanComponent } from './plan/plan.component';
import { UserAuthGuard } from './user-auth.guard';
import { DirectorAuthGuard } from './director-auth.guard';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component:LoginComponent },
  { path: 'sign-up', component:SignUpComponent},
  { path: 'user', component:UserComponent},
  { path: 'plan', component:PlanComponent},
  { path: 'user', component: UserComponent, canActivate: [UserAuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [DirectorAuthGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }