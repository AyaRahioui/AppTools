import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserComponent } from './user/user.component';
import { PlanComponent } from './plan/plan.component';
import { ResultComponent } from './result/result.component';
import { UserAuthGuard } from './user-auth.guard';
import { DirectorAuthGuard } from './director-auth.guard';
import { AdminComponent } from './admin/admin.component';
import { AfterLoginService } from './services/after-login.service';
import { BeforeLoginService } from './services/before-login.service';
import { ShowResComponent } from './show-res/show-res.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { EvaluateComponent } from './evaluate/evaluate.component';
import { RemindersComponent } from './reminders/reminders.component';
import { ActionComponent } from './action/action.component';
import { ProjectsComponent } from './projects/projects.component';
import { RoleComponent } from './role/role.component';
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component:LoginComponent },
  { path: 'sign-up', component:SignUpComponent},
  { path: 'img', component:ImageUploadComponent ,canActivate: [AfterLoginService]},
  { path: 'action', component:ActionComponent ,canActivate: [AfterLoginService] },
  { path: 'projects', component:ProjectsComponent ,canActivate: [AfterLoginService]},
  { path: 'schedule', component:ScheduleComponent ,canActivate: [AfterLoginService]},
  { path: 'evaluate', component:EvaluateComponent ,canActivate: [AfterLoginService] },
  { path: 'reminder', component:RemindersComponent ,canActivate: [AfterLoginService]},
  { path: 'projects/:category', component: ProjectsComponent },
{ path: 'plan/:day', component:PlanComponent,canActivate:[AfterLoginService]},
 { path: 'result', component:ResultComponent  ,canActivate:[AfterLoginService,DirectorAuthGuard]},
  { path: 'user', component: UserComponent , canActivate: [AfterLoginService, UserAuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [DirectorAuthGuard] },
  { path: 'showRes/:id', component: ShowResComponent,canActivate: [AfterLoginService, DirectorAuthGuard] },
  { path: 'role', component: RoleComponent,canActivate: [AfterLoginService, DirectorAuthGuard] },
  { path: '**', redirectTo: '/login' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }